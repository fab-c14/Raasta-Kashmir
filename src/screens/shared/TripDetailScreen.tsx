import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Gauge, MapPin, ShieldCheck, Timer } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { StatCard } from '../../components/ui/StatCard';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertListItem } from '../../components/AlertListItem';
import { LiveMap } from '../../components/LiveMap';
import { SafetyScoreRing } from '../../components/SafetyScoreRing';
import { AppStackParamList } from '../../navigation/types';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { formatDate, formatDuration, formatSpeed } from '../../utils/format';

type DetailRoute = RouteProp<AppStackParamList, 'TripDetail'>;

const TripDetailScreen: React.FC = () => {
  const { params } = useRoute<DetailRoute>();
  const { colors, spacing } = useAppTheme();
  const { trip } = params;
  const alerts = trip.events.filter((e) => e.type !== 'trip_started' && e.type !== 'trip_ended');
  const lastPoint = trip.path[trip.path.length - 1] ?? null;

  return (
    <ScreenContainer>
      <ScreenHeader title="Trip Detail" subtitle={`${trip.routeName} · ${formatDate(trip.startedAt)}`} />

      <View style={styles.headerRow}>
        <SafetyScoreRing score={trip.safetyScore} size={110} />
        <View style={styles.headerText}>
          <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>{trip.driverName}</Text>
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 2 }]}>
            {trip.busNo}
          </Text>
        </View>
      </View>

      <View style={[styles.statsRow, { marginTop: spacing.lg }]}>
        <StatCard label="Duration" value={formatDuration((trip.endedAt ?? trip.startedAt) - trip.startedAt)} icon={Timer} />
        <StatCard label="Distance" value={`${trip.distanceKm.toFixed(1)} km`} icon={MapPin} tint={colors.secondaryAccent} />
        <StatCard label="Max Speed" value={formatSpeed(trip.maxSpeedKmh)} icon={Gauge} tint={colors.warning} />
      </View>

      <SectionTitle title="Route" />
      <LiveMap busLocation={lastPoint} height={220} followBus={false} />

      <SectionTitle title={`Safety Events (${alerts.length})`} />
      {alerts.length === 0 ? (
        <EmptyState icon={ShieldCheck} title="Clean trip" message="No overspeeding, long stops or route deviations were detected." />
      ) : (
        alerts.map((event) => <AlertListItem key={event.id} event={event} />)
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  headerText: { flex: 1 },
  statsRow: { flexDirection: 'row', gap: 12 },
});

export default TripDetailScreen;
