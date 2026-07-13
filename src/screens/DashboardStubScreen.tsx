import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../hooks/useAppTheme';
import { 
  LogOut, 
  ShieldAlert, 
  MapPin, 
  Bus, 
  Award, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Bell,
  Navigation
} from 'lucide-react-native';

const DashboardStubScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const { colors, spacing, roundness, shadows, isDark } = useAppTheme();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

  const renderDriverContent = () => (
    <View style={styles.contentContainer}>
      {/* Safety Score Section */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>YOUR AI SAFETY SCORE</Text>
        <View style={styles.scoreRow}>
          <View style={[styles.scoreBadge, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.scoreText, { color: colors.primary }]}>94</Text>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={[styles.scoreStatus, { color: colors.textPrimary }]}>Excellent Standing</Text>
            <Text style={[styles.scoreSubText, { color: colors.textSecondary }]}>Safe cornering, strict adherence to speed limits.</Text>
          </View>
        </View>
      </View>

      {/* Vehicle Info */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <View style={styles.row}>
          <Bus size={24} color={colors.primary} />
          <View style={styles.textGroup}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Assigned Vehicle</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>
              {user?.vehicleNo || 'JK-01-A-1234'} • {user?.licenseNo || 'Class A Commercial'}
            </Text>
          </View>
        </View>
      </View>

      {/* Control Actions */}
      <TouchableOpacity 
        activeOpacity={0.9} 
        style={[styles.primaryButton, { backgroundColor: colors.primary }, shadows.md]}
      >
        <Navigation size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Start School Trip</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        activeOpacity={0.9} 
        style={[styles.dangerButton, { backgroundColor: colors.danger }, shadows.md]}
      >
        <ShieldAlert size={20} color="#FFFFFF" style={styles.buttonIcon} />
        <Text style={styles.primaryButtonText}>Emergency SOS</Text>
      </TouchableOpacity>
    </View>
  );

  const renderParentContent = () => (
    <View style={styles.contentContainer}>
      {/* Live Track Summary */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <View style={styles.badgeRow}>
          <View style={[styles.statusIndicator, { backgroundColor: colors.success }]} />
          <Text style={[styles.badgeText, { color: colors.success }]}>BUS IS ON ROUTE</Text>
        </View>
        <Text style={[styles.etaValue, { color: colors.secondaryAccent }]}>12 MINS AWAY</Text>
        <Text style={[styles.etaSub, { color: colors.textSecondary }]}>Estimated arrival at Home Stop (Bagh-e-Ali)</Text>
      </View>

      {/* Driver Quality Card */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>ASSIGNED DRIVER</Text>
        <View style={styles.driverMeta}>
          <Award size={24} color={colors.aiAccent} />
          <View style={styles.textGroup}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>{user?.name || 'Jehangir Dar'}</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Safety Rating: 94% Excellent</Text>
          </View>
        </View>
      </View>

      {/* Stopped Stops */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <View style={styles.row}>
          <MapPin size={24} color={colors.primary} />
          <View style={styles.textGroup}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Last Stop Passed</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Lal Bazar Crossing at 14:18 PM</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderSchoolContent = () => (
    <View style={styles.contentContainer}>
      {/* Fleet Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={[styles.gridItem, { backgroundColor: colors.card }, shadows.sm]}>
          <Bus size={22} color={colors.primary} />
          <Text style={[styles.gridNumber, { color: colors.textPrimary }]}>4 / 5</Text>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Active Buses</Text>
        </View>
        <View style={[styles.gridItem, { backgroundColor: colors.card }, shadows.sm]}>
          <AlertTriangle size={22} color={colors.warning} />
          <Text style={[styles.gridNumber, { color: colors.textPrimary }]}>0</Text>
          <Text style={[styles.gridLabel, { color: colors.textSecondary }]}>Active Alerts</Text>
        </View>
      </View>

      {/* Active Rankings */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>TOP RATED DRIVERS</Text>
        <View style={styles.leaderboardRow}>
          <Award size={18} color="#FFD700" />
          <Text style={[styles.driverRankName, { color: colors.textPrimary }]}>Jehangir Dar</Text>
          <Text style={[styles.driverRankScore, { color: colors.primary }]}>94</Text>
        </View>
        <View style={styles.leaderboardRow}>
          <Award size={18} color="#C0C0C0" />
          <Text style={[styles.driverRankName, { color: colors.textPrimary }]}>Mohammad Yusuf</Text>
          <Text style={[styles.driverRankScore, { color: colors.primary }]}>89</Text>
        </View>
      </View>

      {/* Incident Reports */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <View style={styles.row}>
          <TrendingUp size={24} color={colors.secondaryAccent} />
          <View style={styles.textGroup}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Overall Fleet Compliance</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>96.4% safe operation rate this week.</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderRTOContent = () => (
    <View style={styles.contentContainer}>
      {/* Compliance Overview */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>SRINAGAR REGION COMPLIANCE</Text>
        <Text style={[styles.etaValue, { color: colors.primary }]}>98.2%</Text>
        <Text style={[styles.etaSub, { color: colors.textSecondary }]}>Out of 142 registered school transport vehicles</Text>
      </View>

      {/* Violations Log */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>RECENT VIOLATIONS</Text>
        <View style={styles.violationRow}>
          <AlertTriangle size={18} color={colors.danger} />
          <View style={styles.violationText}>
            <Text style={[styles.violationTitle, { color: colors.textPrimary }]}>Overspeeding (62 km/h)</Text>
            <Text style={[styles.violationSub, { color: colors.textSecondary }]}>Bus JK-01-A-4321 • Foreshore Rd</Text>
          </View>
        </View>
      </View>

      {/* Reports */}
      <View style={[styles.card, { backgroundColor: colors.card }, shadows.md]}>
        <View style={styles.row}>
          <FileText size={24} color={colors.aiAccent} />
          <View style={styles.textGroup}>
            <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>Download Violation History</Text>
            <Text style={[styles.itemSub, { color: colors.textSecondary }]}>Format: PDF/CSV generated monthly.</Text>
          </View>
        </View>
      </View>
    </View>
  );

  const getPortalTitle = () => {
    switch (user?.role) {
      case 'driver': return 'Driver Safety Portal';
      case 'parent': return 'Parent Tracking Portal';
      case 'school': return 'School Fleet Portal';
      case 'rto': return 'RTO Monitoring Portal';
      default: return 'Raasta Dashboard';
    }
  };

  const getPortalSubtitle = () => {
    switch (user?.role) {
      case 'driver': return 'Raasta Safety Copilot';
      case 'parent': return 'Realtime Bus Tracking';
      case 'school': return 'Fleet Health & Safety';
      case 'rto': return 'Compliance Oversight';
      default: return 'School Trip Safety';
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome Back,</Text>
            <Text style={[styles.nameText, { color: colors.textPrimary }]}>{user?.name}</Text>
          </View>
          <View style={[styles.roleBadge, { backgroundColor: colors.aiAccent + '15' }]}>
            <Text style={[styles.roleText, { color: colors.aiAccent }]}>{user?.role?.toUpperCase()}</Text>
          </View>
        </View>

        {/* Portal Descriptor */}
        <View style={styles.portalCard}>
          <Text style={[styles.portalTitle, { color: colors.textPrimary }]}>{getPortalTitle()}</Text>
          <Text style={[styles.portalSub, { color: colors.textSecondary }]}>{getPortalSubtitle()}</Text>
        </View>

        {/* Dynamic Role Content */}
        {user?.role === 'driver' && renderDriverContent()}
        {user?.role === 'parent' && renderParentContent()}
        {user?.role === 'school' && renderSchoolContent()}
        {user?.role === 'rto' && renderRTOContent()}

        {/* Logout Button */}
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={handleLogout}
          style={[styles.logoutButton, { borderColor: colors.border }]}
        >
          <LogOut size={18} color={colors.danger} />
          <Text style={[styles.logoutText, { color: colors.danger }]}>Sign Out Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  nameText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 22,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 11,
    letterSpacing: 1,
  },
  portalCard: {
    marginBottom: 20,
  },
  portalTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  portalSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  contentContainer: {
    width: '100%',
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  cardLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreStatus: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
  },
  scoreSubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textGroup: {
    marginLeft: 16,
    flex: 1,
  },
  itemTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  itemSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  primaryButtonText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  dangerButton: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 10,
    letterSpacing: 1,
  },
  etaValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
  },
  etaSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 4,
  },
  driverMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'flex-start',
  },
  gridNumber: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    marginTop: 8,
  },
  gridLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  driverRankName: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    marginLeft: 12,
    flex: 1,
  },
  driverRankScore: {
    fontFamily: 'Poppins-Bold',
    fontSize: 13,
  },
  violationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 4,
  },
  violationText: {
    marginLeft: 12,
    flex: 1,
  },
  violationTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  violationSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 11,
    marginTop: 2,
  },
  logoutButton: {
    height: 50,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  logoutText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default DashboardStubScreen;
