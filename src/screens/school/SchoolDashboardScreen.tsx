import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Bus, ShieldCheck, Siren, TrendingDown, TrendingUp, Minus } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { AiInsightCard } from '../../components/AiInsightCard';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { tripService } from '../../services/tripService';
import { aiService } from '../../services/aiService';
import { AnalyticsSummary, FleetBus } from '../../types/fleet';
import { WeeklyInsight } from '../../types/ai';
import { useBusTracking } from '../../hooks/useBusTracking';
import { DEMO_BUS_NO } from '../../constants/demoRoute';

const SchoolDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors, spacing } = useAppTheme();
  const [fleet, setFleet] = useState<FleetBus[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [insights, setInsights] = useState<WeeklyInsight[] | null>(null);
  const { bus: liveBus, events } = useBusTracking(DEMO_BUS_NO);

  useEffect(() => {
    Promise.all([tripService.getFleet(), tripService.getAnalytics(), aiService.getWeeklyInsights()])
      .then(([fleetData, analyticsData, insightData]) => {
        setFleet(fleetData);
        setAnalytics(analyticsData);
        setInsights(insightData);
      })
      .catch(() => undefined);
  }, []);

  const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
  const hasSos = events.some((event) => event.type === 'sos');

  return (
    <ScreenContainer>
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

      {analytics ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statsRow}>
          <StatCard label="Active Trips" value={String(analytics.activeTrips)} icon={Bus} />
          <StatCard label="Fleet Score" value={String(analytics.avgFleetSafetyScore)} icon={ShieldCheck} tint={colors.aiAccent} />
          <StatCard label="Alerts (7d)" value={String(analytics.totalViolationsWeek)} icon={Siren} tint={colors.warning} />
        </Animated.View>
      ) : (
        <Skeleton height={110} />
      )}

      <SectionTitle title="Live Fleet" />
      {fleet === null ? (
        [0, 1, 2].map((i) => <Skeleton key={i} height={78} style={{ marginBottom: 10 }} />)
      ) : (
        fleet.map((busItem, index) => {
          const isTracked = busItem.busNo === DEMO_BUS_NO && liveBus !== null;
          const status = isTracked ? liveBus.status : busItem.status;
          return (
            <Animated.View key={busItem.busNo} entering={FadeInDown.delay(index * 60).duration(350)}>
              <AppCard style={styles.busRow}>
                <View style={[styles.busIcon, { backgroundColor: `${colors.primary}1A` }]}>
                  <Bus size={17} color={colors.primary} />
                </View>
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
        <Skeleton height={180} />
      ) : (
        insights.map((insight) => {
          const Trend = trendIcon[insight.trend];
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
  busIcon: { width: 36, height: 36, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  busBody: { flex: 1, paddingHorizontal: 12 },
  insightRow: { flexDirection: 'row', alignItems: 'flex-start' },
});

export default SchoolDashboardScreen;
