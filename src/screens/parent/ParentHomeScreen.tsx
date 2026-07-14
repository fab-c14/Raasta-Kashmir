import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BellRing, Gauge, MapPin, User } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { LiveMap } from '../../components/LiveMap';
import { AlertListItem } from '../../components/AlertListItem';
import { useAuth } from '../../context/AuthContext';
import { useBusTracking } from '../../hooks/useBusTracking';
import { usePickupProximity } from '../../hooks/usePickupProximity';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { DEMO_BUS_NO, DEMO_STOPS } from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

const PICKUP_KEY = '@raasta_pickup_stop';
// The final stop is the school itself — not a pickup point.
const PICKUP_STOPS = DEMO_STOPS.slice(0, -1);

const proximityMessage: Record<string, string> = {
  approaching: 'Bus is about 1 km away — get ready.',
  imminent: 'Bus is under 500 m away — head to the stop now!',
  arrived: 'Bus has reached the pickup stop.',
  passed: 'Bus has passed this stop.',
};

const ParentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<Navigation>();
  const { colors, spacing } = useAppTheme();
  const busNo = user?.assignedBusNo ?? DEMO_BUS_NO;
  const { bus, events } = useBusTracking(busNo);

  const [pickupName, setPickupName] = useState<string | null>(null);
  const pickupStop = PICKUP_STOPS.find((stop) => stop.name === pickupName) ?? null;
  const proximity = usePickupProximity(bus, pickupStop);

  useEffect(() => {
    AsyncStorage.getItem(PICKUP_KEY).then((saved) => {
      if (saved) setPickupName(saved);
    });
  }, []);

  const selectPickup = (name: string): void => {
    setPickupName(name);
    AsyncStorage.setItem(PICKUP_KEY, name).catch(() => undefined);
  };

  const statusTone = bus?.status === 'sos' ? 'danger' : bus?.status === 'active' ? 'success' : 'neutral';
  const statusLabel =
    bus?.status === 'sos' ? 'EMERGENCY' : bus?.status === 'active' ? 'On the way' : 'Not started';
  const showProximityBanner =
    proximity.phase === 'approaching' || proximity.phase === 'imminent' || proximity.phase === 'arrived';

  return (
    <ScreenContainer>
      <ScreenHeader title="Track Bus" subtitle={`${busNo} · ${user?.schoolName ?? 'School'}`} showLogout />

      {showProximityBanner ? (
        <AppCard accent={proximity.phase === 'imminent' ? 'danger' : 'ai'} style={{ marginBottom: spacing.md }}>
          <View style={styles.bannerRow}>
            <BellRing size={18} color={proximity.phase === 'imminent' ? colors.danger : colors.aiAccent} />
            <Text style={[typography.titleMedium, styles.bannerText, { color: colors.textPrimary }]} numberOfLines={2}>
              {proximityMessage[proximity.phase ?? 'approaching']}
            </Text>
          </View>
        </AppCard>
      ) : null}

      <Animated.View entering={FadeInDown.duration(400)}>
        <LiveMap
          busLocation={bus?.location ?? null}
          heading={bus?.heading ?? 0}
          height={260}
          pickupLocation={pickupStop?.location ?? null}
          onExpand={() => navigation.navigate('FullMap', { busNo, pickupStopName: pickupName ?? undefined })}
        />
      </Animated.View>

      <SectionTitle title="My Pickup Stop" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        {PICKUP_STOPS.map((stop) => {
          const active = stop.name === pickupName;
          return (
            <TouchableOpacity
              key={stop.name}
              accessibilityRole="button"
              accessibilityLabel={`Set pickup stop to ${stop.name}`}
              onPress={() => selectPickup(stop.name)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[typography.buttonMedium, { color: active ? '#FFFFFF' : colors.textPrimary }]}>
                {stop.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {bus ? (
        <>
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <AppCard style={{ marginTop: spacing.sm }} accent={bus.status === 'sos' ? 'danger' : 'default'}>
              <View style={styles.etaRow}>
                <View style={styles.etaText}>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
                    {pickupStop
                      ? proximity.phase === 'passed'
                        ? `Passed ${pickupStop.name}`
                        : `Reaching ${pickupStop.name} in`
                      : bus.etaMinutes > 0
                        ? `Arriving at ${bus.nextStop}`
                        : 'Live tracking'}
                  </Text>
                  {pickupStop && proximity.etaMinutes !== null && proximity.phase !== 'passed' ? (
                    <Text style={[typography.h1, { color: colors.textPrimary }]}>
                      {proximity.etaMinutes}
                      <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}> min</Text>
                      {proximity.distanceM !== null ? (
                        <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}>
                          {'  ·  '}{proximity.distanceM >= 1000 ? `${(proximity.distanceM / 1000).toFixed(1)} km` : `${proximity.distanceM} m`}
                        </Text>
                      ) : null}
                    </Text>
                  ) : (
                    <Text style={[typography.h2, { color: colors.textPrimary }]} numberOfLines={1}>
                      {bus.etaMinutes > 0 ? `${bus.etaMinutes} min` : bus.nextStop}
                    </Text>
                  )}
                </View>
                <Badge label={statusLabel} tone={statusTone} />
              </View>
            </AppCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(400)} style={[styles.statsRow, { marginTop: spacing.md }]}>
            <StatCard label="Speed" value={`${Math.round(bus.speedKmh)} km/h`} icon={Gauge} tint={bus.speedKmh > 50 ? colors.danger : colors.primary} />
            <StatCard label="Next Stop" value={bus.nextStop} icon={MapPin} tint={colors.secondaryAccent} />
            <StatCard label="Driver" value={bus.driverName.split(' ')[0]} icon={User} tint={colors.aiAccent} />
          </Animated.View>
        </>
      ) : (
        <>
          <Skeleton height={92} style={{ marginTop: spacing.sm }} />
          <Skeleton height={104} style={{ marginTop: spacing.md }} />
        </>
      )}

      <PrimaryButton
        label="Report a Concern"
        onPress={() => navigation.navigate('ReportComplaint')}
        variant="outline"
        style={{ marginTop: spacing.lg }}
      />

      {events.length > 0 ? (
        <>
          <SectionTitle title="Live Safety Alerts" />
          {events.slice(0, 4).map((event) => (
            <AlertListItem key={event.id} event={event} />
          ))}
        </>
      ) : null}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  bannerRow: { flexDirection: 'row', alignItems: 'center' },
  bannerText: { flex: 1, marginLeft: 10 },
  chips: { gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.2,
  },
  etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etaText: { flex: 1, paddingRight: 10 },
  statsRow: { flexDirection: 'row', gap: 12 },
});

export default ParentHomeScreen;
