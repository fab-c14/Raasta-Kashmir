import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Clock, Gauge, MapPin } from 'lucide-react-native';
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
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { DEMO_BUS_NO } from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

const ParentHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<Navigation>();
  const { colors, spacing } = useAppTheme();
  const busNo = user?.assignedBusNo ?? DEMO_BUS_NO;
  const { bus, events } = useBusTracking(busNo);

  const statusTone = bus?.status === 'sos' ? 'danger' : bus?.status === 'active' ? 'success' : 'neutral';
  const statusLabel =
    bus?.status === 'sos' ? 'EMERGENCY' : bus?.status === 'active' ? 'On the way' : 'Not started';

  return (
    <ScreenContainer>
      <ScreenHeader title="Track Bus" subtitle={`${busNo} · ${user?.schoolName ?? 'School'}`} showLogout />

      <Animated.View entering={FadeInDown.duration(400)}>
        <LiveMap busLocation={bus?.location ?? null} heading={bus?.heading ?? 0} height={280} />
      </Animated.View>

      {bus ? (
        <>
          <Animated.View entering={FadeInDown.delay(80).duration(400)}>
            <AppCard style={{ marginTop: spacing.md }} accent={bus.status === 'sos' ? 'danger' : 'default'}>
              <View style={styles.etaRow}>
                <View style={styles.etaText}>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
                    Arriving at {bus.nextStop}
                  </Text>
                  <Text style={[typography.h1, { color: colors.textPrimary }]}>
                    {bus.etaMinutes}
                    <Text style={[typography.bodyMedium, { color: colors.textSecondary }]}> min</Text>
                  </Text>
                </View>
                <Badge label={statusLabel} tone={statusTone} />
              </View>
            </AppCard>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(160).duration(400)} style={[styles.statsRow, { marginTop: spacing.md }]}>
            <StatCard label="Speed" value={`${Math.round(bus.speedKmh)} km/h`} icon={Gauge} tint={bus.speedKmh > 50 ? colors.danger : colors.primary} />
            <StatCard label="Next Stop" value={bus.nextStop} icon={MapPin} tint={colors.secondaryAccent} />
            <StatCard label="Driver" value={bus.driverName.split(' ')[0]} icon={Clock} tint={colors.aiAccent} />
          </Animated.View>
        </>
      ) : (
        <>
          <Skeleton height={92} style={{ marginTop: spacing.md }} />
          <Skeleton height={110} style={{ marginTop: spacing.md }} />
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
  etaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  etaText: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 12 },
});

export default ParentHomeScreen;
