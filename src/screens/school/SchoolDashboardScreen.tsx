import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bus, Minus, ShieldCheck, Siren, TrendingDown, TrendingUp } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { AiInsightCard } from '../../components/AiInsightCard';
import { LiveMap } from '../../components/LiveMap';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { tripService } from '../../services/tripService';
import { aiService } from '../../services/aiService';
import { AnalyticsSummary, FleetBus } from '../../types/fleet';
import { WeeklyInsight } from '../../types/ai';
import { useBusTracking } from '../../hooks/useBusTracking';
import { DEMO_BUS_NO } from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';

const SchoolDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const { colors, spacing } = useAppTheme();
  const [fleet, setFleet] = useState<FleetBus[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [insights, setInsights] = useState<WeeklyInsight[] | null>(null);
  const { bus: liveBus, events } = useBusTracking(DEMO_BUS_NO);

  // Each section loads on its own — one slow or failed request never blanks
  // the rest of the dashboard.
  const load = useCallback(async (): Promise<void> => {
    await Promise.allSettled([
      tripService.getFleet().then(setFleet).catch(() => setFleet([])),
      tripService.getAnalytics().then(setAnalytics).catch(() => setAnalytics(null)),
      aiService.getWeeklyInsights().then(setInsights).catch(() => setInsights([])),
    ]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  const hasSos = events.some((event) => event.type === 'sos');

  return (
    <ScreenContainer onRefresh={load}>
      <ScreenHeader title="Fleet Monitor" subtitle={user?.schoolName ?? 'School Transport'} showLogout />

      {hasSos ? (
        <AppCard accent="danger" style={{ marginBottom: spacing.md }}>
          <View style={styles.sosRow}>
            <Siren size={18} color={colors.danger} />
            <Text style={[typography.titleMedium, { color: colors.danger, marginLeft: 8 }]}>
              ACTIVE SOS — {DEMO_BUS_NO}
            </Text>
          </View>
        </AppCard>
      ) : null}

      <Animated.View entering={FadeInDown.duration(400)}>
        <LiveMap
          busLocation={liveBus?.location ?? null}
          heading={liveBus?.heading ?? 0}
          height={210}
          onExpand={() => navigation.navigate('FullMap', { busNo: DEMO_BUS_NO })}
        />
        {liveBus ? (
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 6 }]} numberOfLines={1}>
            {DEMO_BUS_NO} · {Math.round(liveBus.speedKmh)} km/h · next stop {liveBus.nextStop}
          </Text>
        ) : null}
      </Animated.View>

      <View style={{ marginTop: spacing.md }}>
        {analytics ? (
          <Animated.View entering={FadeInDown.duration(400)} style={styles.statsRow}>
            <StatCard label="Active Trips" value={String(analytics.activeTrips)} icon={Bus} />
            <StatCard label="Fleet Score" value={String(analytics.avgFleetSafetyScore)} icon={ShieldCheck} tint={colors.aiAccent} />
            <StatCard label="Alerts (7d)" value={String(analytics.totalViolationsWeek)} icon={Siren} tint={colors.warning} />
          </Animated.View>
        ) : (
          <Skeleton height={104} />
        )}
      </View>

      <SectionTitle title="Live Fleet" />
      {fleet === null ? (
        [0, 1, 2].map((i) => <Skeleton key={i} height={74} style={{ marginBottom: 10 }} />)
      ) : (
        fleet.map((busItem, index) => {
          const isTracked = busItem.busNo === DEMO_BUS_NO && liveBus !== null;
          const status = isTracked ? liveBus.status : busItem.status;
          return (
            <Animated.View key={busItem.busNo} entering={FadeInDown.delay(index * 50).duration(350)}>
              <AppCard style={styles.busRow}>
                <Bus size={18} color={colors.primary} />
                <View style={styles.busBody}>
                  <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>{busItem.busNo}</Text>
                  <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
                    {busItem.driverName} · {isTracked ? `${Math.round(liveBus.speedKmh)} km/h · ETA ${liveBus.etaMinutes}m` : busItem.routeName}
                  </Text>
                </View>
                <Badge
                  label={status === 'sos' ? 'SOS' : status === 'active' ? 'Live' : 'Idle'}
                  tone={status === 'sos' ? 'danger' : status === 'active' ? 'success' : 'neutral'}
                />
              </AppCard>
            </Animated.View>
          );
        })
      )}

      <SectionTitle title="AI Weekly Insights" />
      {insights === null ? (
        <Skeleton height={160} />
      ) : (
        insights.map((insight) => {
          const Trend = trendIcon[insight.trend] ?? Minus;
          return (
            <AiInsightCard key={insight.title} title={insight.title}>
              <View style={styles.insightRow}>
                <Trend size={15} color={insight.trend === 'up' ? colors.success : insight.trend === 'down' ? colors.danger : colors.textSecondary} />
                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginLeft: 8, flex: 1 }]}>
                  {insight.detail}
                </Text>
              </View>
            </AiInsightCard>
          );
        })
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 12 },
  sosRow: { flexDirection: 'row', alignItems: 'center' },
  busRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  busBody: { flex: 1, paddingHorizontal: 12 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start' },
});

export default SchoolDashboardScreen;
