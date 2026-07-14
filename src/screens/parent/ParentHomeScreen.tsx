import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BellRing, Gauge, MapPin, User, GraduationCap } from 'lucide-react-native';
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
import { Student } from '../../types/fleet';
import { tripService } from '../../services/tripService';

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

  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [pickupName, setPickupName] = useState<string | null>(null);

  const [linkCode, setLinkCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [showLinkCard, setShowLinkCard] = useState(false);

  const busNo = selectedStudent?.busNo ?? user?.assignedBusNo ?? DEMO_BUS_NO;
  const { bus, events } = useBusTracking(busNo);

  const pickupStop = PICKUP_STOPS.find((stop) => stop.name === pickupName) ?? null;
  const proximity = usePickupProximity(bus, pickupStop);

  const handleLinkChild = async () => {
    if (!user || !linkCode.trim()) return;
    setIsLinking(true);
    setLinkError(null);
    try {
      const code = linkCode.trim();
      const allStudents = await tripService.getStudents();
      const formattedCode = code.toLowerCase().replace('stu-', 'stu_');
      const targetCode = formattedCode.startsWith('stu_') ? formattedCode : `stu_${formattedCode}`;

      const matched = allStudents.find(
        (s) => s.id.toLowerCase() === targetCode || s.id.toLowerCase() === code.toLowerCase()
      );

      if (!matched) {
        setLinkError('Invalid invite code. Try STU-1, STU-2 or STU-arman.');
        setIsLinking(false);
        return;
      }

      await tripService.linkParentToStudent(matched.id, user.name);

      // Reload students list
      const updated = await tripService.getStudents();
      const myStudents = updated.filter((s) => s.parentName === user.name);
      setStudents(myStudents);

      // Select the newly added child
      const newChild = myStudents.find((s) => s.id === matched.id);
      if (newChild) {
        setSelectedStudent(newChild);
        if (newChild.pickupStop) setPickupName(newChild.pickupStop);
      }

      setLinkCode('');
      setShowLinkCard(false);
      Alert.alert('Linked Successfully', `${matched.name} is now connected to your account.`);
    } catch (err) {
      setLinkError('Failed to link child. Check connection.');
    } finally {
      setIsLinking(false);
    }
  };

  useEffect(() => {
    // 1. Fetch all students and find the children of the logged-in parent
    tripService
      .getStudents()
      .then((allStudents) => {
        const parentName = user?.name ?? 'Amina Shah';
        const myStudents = allStudents.filter((s) => s.parentName === parentName);
        setStudents(myStudents);
        if (myStudents.length > 0) {
          setSelectedStudent(myStudents[0]);
          if (myStudents[0].pickupStop) {
            setPickupName(myStudents[0].pickupStop);
          }
        }
      })
      .catch((err) => console.error('Error fetching students for parent:', err));

    // 2. Load stored custom pickup stop if any
    AsyncStorage.getItem(PICKUP_KEY).then((saved) => {
      if (saved) setPickupName(saved);
    });
  }, [user]);

  const selectStudent = (student: Student): void => {
    setSelectedStudent(student);
    if (student.pickupStop) {
      setPickupName(student.pickupStop);
    }
  };

  const selectPickup = (name: string): void => {
    setPickupName(name);
    AsyncStorage.setItem(PICKUP_KEY, name).catch(() => undefined);
  };

  const statusTone =
    bus?.status === 'sos'
      ? 'danger'
      : bus?.status === 'active'
        ? 'success'
        : bus?.status === 'completed'
          ? 'info'
          : 'neutral';
  const statusLabel =
    bus?.status === 'sos'
      ? 'EMERGENCY'
      : bus?.status === 'active'
        ? 'On the way'
        : bus?.status === 'completed'
          ? 'Trip completed'
          : 'Not started';
  const showProximityBanner =
    proximity.phase === 'approaching' || proximity.phase === 'imminent' || proximity.phase === 'arrived';

  return (
    <ScreenContainer>
      <ScreenHeader title="Track Bus" subtitle={`${busNo} · ${user?.schoolName ?? 'School'}`} showLogout />

      {students.length === 0 ? (
        <Animated.View entering={FadeInDown.duration(400)}>
          <AppCard style={{ marginVertical: spacing.md, padding: 16 }}>
            <Text style={[typography.titleMedium, { color: colors.textPrimary, textAlign: 'center', fontFamily: 'Poppins-SemiBold' }]}>
              No Linked Children
            </Text>
            <Text style={[typography.bodyMedium, { color: colors.textSecondary, textAlign: 'center', marginTop: 6, marginBottom: 16 }]}>
              To start tracking, enter your child's student invite code provided by the school.
            </Text>

            <TextInput
              placeholder="Enter Code (e.g. STU-1, STU-arman)"
              placeholderTextColor={colors.textSecondary}
              value={linkCode}
              onChangeText={setLinkCode}
              style={{
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 8,
                paddingHorizontal: 12,
                height: 42,
                color: colors.textPrimary,
                backgroundColor: colors.surface,
                fontFamily: 'Poppins-Regular',
                fontSize: 14,
                marginBottom: 12,
              }}
            />
            {linkError ? (
              <Text style={[typography.bodySmall, { color: colors.danger, marginBottom: 12, paddingHorizontal: 4 }]}>
                {linkError}
              </Text>
            ) : null}
            <PrimaryButton
              label="Link Child Account"
              onPress={handleLinkChild}
              loading={isLinking}
              variant="gradient"
            />
          </AppCard>
        </Animated.View>
      ) : (
        <>
          {/* Select Student Selector */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <SectionTitle
              title="Students Tracker"
              action={
                <TouchableOpacity onPress={() => setShowLinkCard(!showLinkCard)}>
                  <Text style={[typography.buttonMedium, { color: colors.primary, fontFamily: 'Poppins-SemiBold' }]}>
                    {showLinkCard ? 'Cancel' : '+ Link Child'}
                  </Text>
                </TouchableOpacity>
              }
            />

            {showLinkCard ? (
              <AppCard style={{ marginBottom: spacing.md, padding: 12 }}>
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                  <TextInput
                    placeholder="Enter Invite Code (e.g. STU-2)"
                    placeholderTextColor={colors.textSecondary}
                    value={linkCode}
                    onChangeText={setLinkCode}
                    style={{
                      borderColor: colors.border,
                      borderWidth: 1,
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      height: 36,
                      color: colors.textPrimary,
                      backgroundColor: colors.surface,
                      flex: 1,
                      fontFamily: 'Poppins-Regular',
                      fontSize: 12,
                    }}
                  />
                  <PrimaryButton
                    label="Link"
                    onPress={handleLinkChild}
                    loading={isLinking}
                    variant="gradient"
                    style={{ height: 36, paddingVertical: 0, minWidth: 60 }}
                  />
                </View>
                {linkError ? (
                  <Text style={[typography.caption, { color: colors.danger, marginTop: 4 }]}>
                    {linkError}
                  </Text>
                ) : null}
              </AppCard>
            ) : null}

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {students.map((student) => {
                const active = selectedStudent?.id === student.id;
                return (
                  <TouchableOpacity
                    key={student.id}
                    accessibilityRole="button"
                    accessibilityLabel={`Track bus for ${student.name}`}
                    onPress={() => selectStudent(student)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: active ? colors.primary : colors.card,
                        borderColor: active ? colors.primary : colors.border,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                      },
                    ]}
                  >
                    <GraduationCap size={16} color={active ? '#FFFFFF' : colors.primary} />
                    <Text style={[typography.buttonMedium, { color: active ? '#FFFFFF' : colors.textPrimary }]}>
                      {student.name} ({student.className.split(' ')[1] ?? student.className})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Animated.View>

          {showProximityBanner ? (
            <AppCard accent={proximity.phase === 'imminent' ? 'danger' : 'default'} style={{ marginBottom: spacing.md, marginTop: spacing.xs }}>
              <View style={styles.bannerRow}>
                <BellRing size={18} color={proximity.phase === 'imminent' ? colors.danger : colors.primary} />
                <Text style={[typography.titleMedium, styles.bannerText, { color: colors.textPrimary }]} numberOfLines={2}>
                  {proximityMessage[proximity.phase ?? 'approaching']}
                </Text>
              </View>
            </AppCard>
          ) : null}

          <Animated.View entering={FadeInDown.duration(400)} style={{ marginTop: spacing.md }}>
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
                      {selectedStudent ? (
                        <Text style={[typography.caption, { color: colors.primary, fontFamily: 'Poppins-SemiBold', marginBottom: 2 }]}>
                          Child: {selectedStudent.name} ({selectedStudent.className})
                        </Text>
                      ) : null}
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
                <StatCard label="Driver" value={bus.driverName.split(' ')[0]} icon={User} />
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
        </>
      )}
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
