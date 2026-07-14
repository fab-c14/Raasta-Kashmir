import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Siren } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { SafetyScoreRing } from '../../components/SafetyScoreRing';
import { LiveMap } from '../../components/LiveMap';
import { AlertListItem } from '../../components/AlertListItem';
import { useAuth } from '../../context/AuthContext';
import { useTrip } from '../../context/TripContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { SPEED_LIMIT_KMH } from '../../constants/safety';
import { DEMO_BUS_NO, DEMO_ROUTE_NAME } from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';
import { formatKm } from '../../utils/format';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

const DriverHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const { trip, lastPoint, liveScore, isSimulatedGps, startTrip, endTrip, triggerSos } = useTrip();
  const { colors, spacing } = useAppTheme();
  const navigation = useNavigation<Navigation>();

  const speed = lastPoint?.speedKmh ?? 0;
  const isOverspeed = speed > SPEED_LIMIT_KMH;
  const recentAlerts = trip
    ? [...trip.events].reverse().filter((e) => e.type !== 'trip_started').slice(0, 4)
    : [];

  const handleStart = async (): Promise<void> => {
    if (user) await startTrip(user);
  };

  const handleEnd = async (): Promise<void> => {
    const finished = await endTrip();
    if (finished) navigation.navigate('TripSummary', { trip: finished });
  };

  const handleSos = (): void => {
    Alert.alert('Emergency SOS', 'Alert the school, parents and RTO immediately?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send SOS', style: 'destructive', onPress: triggerSos },
    ]);
  };

  return (
    <ScreenContainer>
      <ScreenHeader
        title={`Salaam, ${user?.name.split(' ')[0] ?? 'Driver'}`}
        subtitle={user?.vehicleNo ?? DEMO_ROUTE_NAME}
        showLogout
      />

      <Animated.View entering={FadeInDown.duration(400)}>
        <LiveMap
          busLocation={lastPoint}
          height={240}
          followBus={trip !== null}
          onExpand={() => navigation.navigate('FullMap', { busNo: user?.vehicleNo ?? DEMO_BUS_NO })}
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(400)} style={[styles.statsRow, { marginTop: spacing.md }]}>
        <AppCard style={styles.speedCard}>
          <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>Current Speed</Text>
          <Text style={[typography.h1, { color: isOverspeed ? colors.danger : colors.textPrimary }]}>
            {Math.round(speed)}
            <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}> km/h</Text>
          </Text>
          <Badge
            label={isOverspeed ? `Over ${SPEED_LIMIT_KMH} km/h limit` : `Limit ${SPEED_LIMIT_KMH} km/h`}
            tone={isOverspeed ? 'danger' : 'success'}
          />
          {trip ? (
            <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 8 }]}>
              {formatKm(trip.distanceKm)} covered
            </Text>
          ) : null}
        </AppCard>
        <AppCard style={styles.scoreCard}>
          <SafetyScoreRing score={trip ? liveScore : 100} size={104} />
        </AppCard>
      </Animated.View>

      {isSimulatedGps && trip ? (
        <Text style={[typography.caption, { color: colors.textSecondary, marginTop: 6 }]}>
          GPS unavailable — demo drive simulation active
        </Text>
      ) : null}

      <Animated.View entering={FadeInDown.delay(160).duration(400)} style={{ marginTop: spacing.lg }}>
        {trip ? (
          <View style={styles.actionsRow}>
            <PrimaryButton label="End Trip" onPress={handleEnd} style={styles.actionButton} />
            <PrimaryButton
              label={trip.status === 'sos' ? 'SOS SENT' : 'SOS'}
              onPress={handleSos}
              variant="danger"
              disabled={trip.status === 'sos'}
              style={styles.sosButton}
            />
          </View>
        ) : (
          <PrimaryButton label="Start Trip" onPress={handleStart} />
        )}
      </Animated.View>

      {trip?.status === 'sos' ? (
        <AppCard accent="danger" style={{ marginTop: spacing.md }}>
          <View style={styles.sosRow}>
            <Siren size={18} color={colors.danger} />
            <Text style={[typography.titleMedium, { color: colors.danger, marginLeft: 8 }]}>
              SOS broadcast to school, parents and RTO
            </Text>
          </View>
        </AppCard>
      ) : null}

      {recentAlerts.length > 0 ? (
        <>
          <SectionTitle title="Trip Alerts" />
          {recentAlerts.map((event) => (
            <AlertListItem key={event.id} event={event} />
          ))}
        </>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 12 },
  speedCard: { flex: 1.2, justifyContent: 'center' },
  scoreCard: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1.6 },
  sosButton: { flex: 1 },
  sosRow: { flexDirection: 'row', alignItems: 'center' },
});

export default DriverHomeScreen;
