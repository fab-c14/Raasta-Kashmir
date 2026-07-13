import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BadgeCheck, Bus, FileWarning, ShieldCheck } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { Skeleton } from '../../components/ui/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { tripService } from '../../services/tripService';
import { AnalyticsSummary, ComplianceRecord } from '../../types/fleet';

const RtoDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors, spacing } = useAppTheme();
  const [records, setRecords] = useState<ComplianceRecord[] | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);

  useEffect(() => {
    Promise.all([tripService.getCompliance(), tripService.getAnalytics()])
      .then(([complianceData, analyticsData]) => {
        setRecords(complianceData);
        setAnalytics(analyticsData);
      })
      .catch(() => undefined);
  }, []);

  return (
    <ScreenContainer>
      <ScreenHeader title="Inspection Dashboard" subtitle={`RTO ${user?.rtoCode ?? 'JK-01'} · Srinagar`} showLogout />

      {analytics ? (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.statsRow}>
          <StatCard label="Compliance" value={`${analytics.complianceRate}%`} icon={BadgeCheck} />
          <StatCard label="Trips Today" value={String(analytics.totalTripsToday)} icon={Bus} tint={colors.secondaryAccent} />
          <StatCard label="SOS (30d)" value={String(analytics.sosCountMonth)} icon={FileWarning} tint={colors.danger} />
        </Animated.View>
      ) : (
        <Skeleton height={110} />
      )}

      <SectionTitle title="Vehicle Compliance" />
      {records === null
        ? [0, 1, 2].map((i) => <Skeleton key={i} height={120} style={{ marginBottom: 10 }} />)
        : records.map((record, index) => (
            <Animated.View key={record.busNo} entering={FadeInDown.delay(index * 60).duration(350)}>
              <AppCard style={{ marginBottom: spacing.sm }} accent={record.isCompliant ? 'default' : 'danger'}>
                <View style={styles.rowHeader}>
                  <View style={styles.rowTitle}>
                    <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>{record.busNo}</Text>
                    <Text style={[typography.caption, { color: colors.textSecondary }]}>{record.schoolName}</Text>
                  </View>
                  <Badge
                    label={record.isCompliant ? 'Compliant' : 'Non-compliant'}
                    tone={record.isCompliant ? 'success' : 'danger'}
                  />
                </View>
                <View style={styles.grid}>
                  {[
                    { label: 'Fitness', value: record.fitnessValidTill },
                    { label: 'Insurance', value: record.insuranceValidTill },
                    { label: 'Permit', value: record.permitValidTill },
                    { label: 'Inspected', value: record.lastInspection },
                  ].map((cell) => (
                    <View key={cell.label} style={styles.cell}>
                      <Text style={[typography.caption, { color: colors.textSecondary }]}>{cell.label}</Text>
                      <Text style={[typography.bodySmall, { color: colors.textPrimary, fontFamily: 'Poppins-Medium' }]}>
                        {cell.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </AppCard>
            </Animated.View>
          ))}

      <AppCard accent="ai" style={{ marginTop: spacing.sm }}>
        <View style={styles.footerRow}>
          <ShieldCheck size={16} color={colors.aiAccent} />
          <Text style={[typography.bodySmall, { color: colors.textSecondary, marginLeft: 8, flex: 1 }]}>
            Compliance data is aggregated from live trip telemetry and school records.
          </Text>
        </View>
      </AppCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  statsRow: { flexDirection: 'row', gap: 12 },
  rowHeader: { flexDirection: 'row', alignItems: 'center' },
  rowTitle: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  cell: { width: '50%', paddingVertical: 4 },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
});

export default RtoDashboardScreen;
