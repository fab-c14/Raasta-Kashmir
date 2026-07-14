import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BellOff, MessageSquareWarning } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { Badge } from '../../components/ui/Badge';
import { SectionTitle } from '../../components/ui/SectionTitle';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertListItem } from '../../components/AlertListItem';
import { useAuth } from '../../context/AuthContext';
import { useBusTracking } from '../../hooks/useBusTracking';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { tripService } from '../../services/tripService';
import { Complaint, ComplaintStatus } from '../../types/fleet';
import { DEMO_BUS_NO } from '../../constants/demoRoute';
import { timeAgo } from '../../utils/format';

const statusCopy: Record<ComplaintStatus, string> = {
  open: 'Waiting for school review',
  reviewing: 'School is reviewing this',
  resolved: 'Resolved by the school',
};

const ParentAlertsScreen: React.FC = () => {
  const { user } = useAuth();
  const { colors, spacing } = useAppTheme();
  const { events } = useBusTracking(user?.assignedBusNo ?? DEMO_BUS_NO);
  const [myReports, setMyReports] = useState<Complaint[] | null>(null);

  // The complaint loop closes here: whatever status the school sets shows
  // up for the parent on the next focus or pull-to-refresh.
  const load = useCallback(async (): Promise<void> => {
    const all = await tripService.getComplaints().catch(() => [] as Complaint[]);
    setMyReports(all.filter((complaint) => complaint.parentName === user?.name));
  }, [user?.name]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const statusTone = (status: ComplaintStatus): 'danger' | 'warning' | 'success' =>
    status === 'open' ? 'danger' : status === 'reviewing' ? 'warning' : 'success';

  return (
    <ScreenContainer onRefresh={load}>
      <ScreenHeader title="Alerts" subtitle="Realtime safety notifications for your bus" />
      {events.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No alerts yet"
          message="Overspeeding, long stops, route deviations and SOS alerts will appear here in real time."
        />
      ) : (
        events.map((event) => <AlertListItem key={event.id} event={event} />)
      )}

      <SectionTitle title="My Reports" />
      {myReports === null ? null : myReports.length === 0 ? (
        <EmptyState
          icon={MessageSquareWarning}
          title="No reports yet"
          message="Concerns you report from the Track screen appear here with the school's review status."
        />
      ) : (
        myReports.map((complaint) => (
          <AppCard key={complaint.id} style={{ marginBottom: spacing.sm }}>
            <View style={styles.reportHeader}>
              <Text style={[typography.caption, styles.reportMeta, { color: colors.textSecondary }]} numberOfLines={1}>
                {complaint.busNo} · {timeAgo(complaint.createdAt)}
              </Text>
              <Badge label={complaint.status.toUpperCase()} tone={statusTone(complaint.status)} />
            </View>
            <Text style={[typography.bodyMedium, { color: colors.textPrimary, marginTop: 6 }]} numberOfLines={3}>
              {complaint.text}
            </Text>
            <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 6 }]}>
              {statusCopy[complaint.status]}
            </Text>
          </AppCard>
        ))
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  reportHeader: { flexDirection: 'row', alignItems: 'center' },
  reportMeta: { flex: 1, paddingRight: 8 },
});

export default ParentAlertsScreen;
