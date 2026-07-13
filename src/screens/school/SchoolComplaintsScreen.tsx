import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MessageSquareWarning, Sparkles } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { AppCard } from '../../components/ui/AppCard';
import { Badge } from '../../components/ui/Badge';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { tripService } from '../../services/tripService';
import { aiService } from '../../services/aiService';
import { Complaint } from '../../types/fleet';
import { timeAgo } from '../../utils/format';

const SchoolComplaintsScreen: React.FC = () => {
  const { colors, spacing } = useAppTheme();
  const [complaints, setComplaints] = useState<Complaint[] | null>(null);
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  useEffect(() => {
    tripService
      .getComplaints()
      .then(setComplaints)
      .catch(() => setComplaints([]));
  }, []);

  const analyze = async (complaint: Complaint): Promise<void> => {
    setAnalyzingId(complaint.id);
    try {
      const analysis = await aiService.analyzeComplaint(complaint.text);
      setComplaints((current) =>
        current?.map((item) => (item.id === complaint.id ? { ...item, analysis } : item)) ?? null
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  const statusTone = (status: Complaint['status']): 'danger' | 'warning' | 'success' =>
    status === 'open' ? 'danger' : status === 'reviewing' ? 'warning' : 'success';

  return (
    <ScreenContainer>
      <ScreenHeader title="Complaints" subtitle="Parent reports with AI categorization" />
      {complaints === null ? (
        [0, 1, 2].map((i) => <Skeleton key={i} height={130} style={{ marginBottom: 12 }} />)
      ) : complaints.length === 0 ? (
        <EmptyState icon={MessageSquareWarning} title="No complaints" message="Parent-submitted concerns will appear here for review." />
      ) : (
        complaints.map((complaint) => (
          <AppCard key={complaint.id} style={{ marginBottom: spacing.md }}>
            <View style={styles.headerRow}>
              <View style={styles.headerText}>
                <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
                  {complaint.busNo}
                </Text>
                <Text style={[typography.caption, { color: colors.textSecondary }]}>
                  {complaint.parentName} · {timeAgo(complaint.createdAt)}
                </Text>
              </View>
              <Badge label={complaint.status.toUpperCase()} tone={statusTone(complaint.status)} />
            </View>
            <Text style={[typography.bodyMedium, { color: colors.textSecondary, marginTop: 8 }]}>
              {complaint.text}
            </Text>

            {complaint.analysis ? (
              <View style={[styles.analysis, { backgroundColor: `${colors.aiAccent}0D`, borderColor: `${colors.aiAccent}33` }]}>
                <View style={styles.badgeRow}>
                  <Badge label={complaint.analysis.category} tone="ai" />
                  <Badge
                    label={`${complaint.analysis.severity.toUpperCase()}`}
                    tone={complaint.analysis.severity === 'high' ? 'danger' : complaint.analysis.severity === 'medium' ? 'warning' : 'success'}
                  />
                </View>
                <Text style={[typography.bodySmall, { color: colors.textPrimary, marginTop: 6 }]}>
                  {complaint.analysis.summary}
                </Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
                  → {complaint.analysis.suggestedAction}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.analyzeButton, { borderColor: colors.aiAccent }]}
                onPress={() => analyze(complaint)}
                disabled={analyzingId === complaint.id}
              >
                <Sparkles size={14} color={colors.aiAccent} />
                <Text style={[typography.buttonMedium, { color: colors.aiAccent, marginLeft: 6 }]}>
                  {analyzingId === complaint.id ? 'Analyzing…' : 'Analyze with AI'}
                </Text>
              </TouchableOpacity>
            )}
          </AppCard>
        ))
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerText: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 6 },
  analysis: {
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.2,
  },
});

export default SchoolComplaintsScreen;
