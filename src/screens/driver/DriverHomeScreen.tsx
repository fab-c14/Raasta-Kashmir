import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Siren, Users, Check } from 'lucide-react-native';
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
import {
  DEMO_BUS_NO,
  DEMO_ROUTE_NAME,
  DEMO_ROUTE_PATH_A,
  DEMO_ROUTE_PATH_B,
  SCHOOL_LOCATION,
  ALL_ROUTES,
} from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';
import { formatKm } from '../../utils/format';
import { locationService } from '../../services/locationService';
import { distanceMeters } from '../../utils/geo';

type Navigation = NativeStackNavigationProp<AppStackParamList>;

const DriverHomeScreen: React.FC = () => {
  const { user } = useAuth();
  const {
    trip,
    lastPoint,
    liveScore,
    isSimulatedGps,
    upcomingPickup,
    busStudents,
    startTrip,
    endTrip,
    triggerSos,
    notifyParentOfPickup,
    setSimulationRoute,
    simulationRoutePath,
  } = useTrip();
  const { colors, spacing } = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const [isDiverging, setIsDiverging] = useState(false);
  const [pickupMessageText, setPickupMessageText] = useState('');

  const speed = lastPoint?.speedKmh ?? 0;
  const isOverspeed = speed > SPEED_LIMIT_KMH;
  const recentAlerts = trip
    ? [...trip.events].reverse().filter((e) => e.type !== 'trip_started').slice(0, 4)
    : [];

  const stopStudentCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    busStudents.forEach((student) => {
      if (student.pickupStop) {
        counts[student.pickupStop] = (counts[student.pickupStop] ?? 0) + 1;
      }
    });
    return counts;
  }, [busStudents]);

  const selectedRouteConfig = React.useMemo(() => {
    return ALL_ROUTES.find((r) => r.path === simulationRoutePath) ?? ALL_ROUTES[0];
  }, [simulationRoutePath]);

  const activeRouteStops = selectedRouteConfig.stops;

  // Set initial simulation route on mount based on driver's vehicle number
  useEffect(() => {
    if (user && !trip) {
      const driverRoute = ALL_ROUTES.find((r) => r.busNo === user.vehicleNo) ?? ALL_ROUTES[0];
      setSimulationRoute(driverRoute.path);
    }
  }, [user, trip, setSimulationRoute]);

  // 1. Passive Auto-Start Effect
  useEffect(() => {
    if (!user || trip) return;

    let active = true;

    const checkAutoStart = async () => {
      // Short delay for UI hydration
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (!active) return;

      const hasPermission = await locationService.requestPermission();
      if (!active) return;

      const driverRoute = ALL_ROUTES.find((r) => r.busNo === user.vehicleNo) ?? ALL_ROUTES[0];
      const schoolLoc = driverRoute.path[driverRoute.path.length - 1];

      if (hasPermission) {
        const location = await locationService.getCurrentLocation();
        if (!active) return;

        if (location) {
          const dist = distanceMeters(location, schoolLoc);
          // If driver is outside school (>150m), auto-start!
          if (dist > 150) {
            await startTrip(user, driverRoute.path);
          }
        } else {
          // If GPS coordinate cannot be resolved, default to auto-start simulation
          await startTrip(user, driverRoute.path);
        }
      } else {
        // If permission denied, auto-start simulation
        await startTrip(user, driverRoute.path);
      }
    };

    checkAutoStart();

    return () => {
      active = false;
    };
  }, [user, trip, startTrip]);

  const handleStart = async (): Promise<void> => {
    if (user) await startTrip(user, isDiverging ? DEMO_ROUTE_PATH_B : simulationRoutePath);
  };

  const handleEnd = async (): Promise<void> => {
    const finished = await endTrip();
    if (finished) navigation.navigate('TripSummary', { trip: finished });
  };

  const handleRouteToggle = () => {
    const nextDiverging = !isDiverging;
    setIsDiverging(nextDiverging);
    setSimulationRoute(nextDiverging ? DEMO_ROUTE_PATH_B : selectedRouteConfig.path);
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
        subtitle={user?.vehicleNo ? `${user.vehicleNo} · ${selectedRouteConfig.routeName}` : selectedRouteConfig.routeName}
        showLogout
      />

      <Animated.View entering={FadeInDown.duration(400)}>
        <LiveMap
          busLocation={lastPoint}
          height={240}
          followBus={trip !== null}
          stopStudentCounts={stopStudentCounts}
          onExpand={() => navigation.navigate('FullMap', { busNo: user?.vehicleNo ?? DEMO_BUS_NO })}
          routePath={simulationRoutePath}
          stops={activeRouteStops}
        />
      </Animated.View>

      {/* Route Detour Control Card (simulation mode only) */}
      {trip && isSimulatedGps ? (
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <AppCard style={{ marginTop: spacing.sm, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>Simulation Detour Control</Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                  {isDiverging ? "Detoured via Boulevard Road (Route B)" : "Following School Assigned Path (Route A)"}
                </Text>
              </View>
              <PrimaryButton
                label={isDiverging ? "Reset to Route A" : "Simulate Detour"}
                onPress={handleRouteToggle}
                variant={isDiverging ? "gradient" : "outline"}
                style={{ minWidth: 120, height: 36, paddingVertical: 0 }}
              />
            </View>
          </AppCard>
        </Animated.View>
      ) : null}

      {/* Upcoming Student Pickup Card */}
      {trip && upcomingPickup ? (
        <Animated.View entering={FadeInDown.duration(400)}>
          <AppCard accent="default" style={{ marginTop: spacing.md }}>
            <View style={styles.pickupRow}>
              <View style={[styles.pickupIconWrap, { backgroundColor: `${colors.primary}1A` }]}>
                <Users size={20} color={colors.primary} />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 10 }}>
                <Text style={[typography.titleMedium, { color: colors.textPrimary }]}>
                  Approaching Stop: {upcomingPickup.stopName}
                </Text>
                <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 1 }]}>
                  Pick up: {upcomingPickup.studentNames.join(', ')}
                </Text>
              </View>
              <PrimaryButton
                label={upcomingPickup.parentNotified ? "Notified ✓" : "Confirm Boarding"}
                onPress={() => {
                  if (pickupMessageText.trim().length > 0) {
                    notifyParentOfPickup(`Message to parent: ${pickupMessageText.trim()}`);
                    setPickupMessageText('');
                  } else {
                    notifyParentOfPickup();
                  }
                }}
                disabled={upcomingPickup.parentNotified}
                variant={upcomingPickup.parentNotified ? "outline" : "gradient"}
                style={{ height: 36, paddingVertical: 0, minWidth: 120 }}
              />
            </View>

            {/* Direct custom message to parent */}
            {!upcomingPickup.parentNotified ? (
              <View style={{ marginTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderColor: colors.border, paddingTop: 12 }}>
                <Text style={[typography.caption, { color: colors.textSecondary, fontFamily: 'Poppins-Medium', marginBottom: 6 }]}>
                  Send message to parents (optional):
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TextInput
                    placeholder="Type message (e.g. Bus is arriving in 2 mins)"
                    placeholderTextColor={colors.textSecondary}
                    value={pickupMessageText}
                    onChangeText={setPickupMessageText}
                    style={{
                      borderColor: colors.border,
                      color: colors.textPrimary,
                      backgroundColor: colors.card,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      height: 36,
                      flex: 1,
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                      borderWidth: 1,
                    }}
                  />
                  <PrimaryButton
                    label="Send Msg"
                    onPress={() => {
                      if (pickupMessageText.trim().length > 0) {
                        notifyParentOfPickup(`Message to parent: ${pickupMessageText.trim()}`);
                        setPickupMessageText('');
                      } else {
                        Alert.alert('Empty Message', 'Please type a message first or tap Confirm Boarding.');
                      }
                    }}
                    variant="gradient"
                    style={{ height: 36, paddingVertical: 0, minWidth: 80 }}
                  />
                </View>
              </View>
            ) : null}
          </AppCard>
        </Animated.View>
      ) : null}

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

      {!trip ? (
        <Animated.View entering={FadeInDown.delay(120).duration(400)} style={{ marginTop: spacing.md }}>
          <SectionTitle title="Select Driving Route" />
          {ALL_ROUTES.map((rConfig) => {
            const isSelected = rConfig.path === simulationRoutePath;
            return (
              <TouchableOpacity
                key={rConfig.busNo}
                onPress={() => setSimulationRoute(rConfig.path)}
                activeOpacity={0.7}
              >
                <AppCard
                  style={{
                    marginBottom: spacing.xs,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? colors.primary : colors.border,
                    padding: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1, paddingRight: 8 }}>
                      <Text style={[typography.titleMedium, { color: colors.textPrimary, fontFamily: 'Poppins-SemiBold' }]}>
                        {rConfig.routeName}
                      </Text>
                      <Text style={[typography.bodySmall, { color: colors.textSecondary }]}>
                        Bus: {rConfig.busNo} · Driver: {rConfig.driverName}
                      </Text>
                    </View>
                    {isSelected && (
                      <View style={{ backgroundColor: colors.primary, borderRadius: 12, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={14} color="#FFFFFF" strokeWidth={3} />
                      </View>
                    )}
                  </View>
                </AppCard>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
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
  pickupRow: { flexDirection: 'row', alignItems: 'center' },
  pickupIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default DriverHomeScreen;
