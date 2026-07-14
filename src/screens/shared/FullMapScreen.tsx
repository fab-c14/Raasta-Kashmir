import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { LiveMap } from '../../components/LiveMap';
import { Badge } from '../../components/ui/Badge';
import { useBusTracking } from '../../hooks/useBusTracking';
import { useAppTheme } from '../../hooks/useAppTheme';
import { typography } from '../../theme/typography';
import { DEMO_STOPS } from '../../constants/demoRoute';
import { AppStackParamList } from '../../navigation/types';
import { formatSpeed } from '../../utils/format';

type FullMapRoute = RouteProp<AppStackParamList, 'FullMap'>;

/** Edge-to-edge live map with the route, stops, bus and pickup point. */
const FullMapScreen: React.FC = () => {
  const { params } = useRoute<FullMapRoute>();
  const navigation = useNavigation();
  const { colors, shadows } = useAppTheme();
  const { bus } = useBusTracking(params.busNo);
  const pickup = DEMO_STOPS.find((stop) => stop.name === params.pickupStopName);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]} edges={['top']}>
      <View style={styles.mapWrap}>
        <LiveMap
          busLocation={bus?.location ?? null}
          heading={bus?.heading ?? 0}
          pickupLocation={pickup?.location ?? null}
        />
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => navigation.goBack()}
          style={[styles.back, shadows.md, { backgroundColor: colors.card }]}
        >
          <ArrowLeft size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        {bus ? (
          <View style={[styles.status, shadows.md, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.statusText}>
              <Text style={[typography.titleMedium, { color: colors.textPrimary }]} numberOfLines={1}>
                {params.busNo}
              </Text>
              <Text style={[typography.bodySmall, { color: colors.textSecondary }]} numberOfLines={1}>
                {formatSpeed(bus.speedKmh)} · next stop {bus.nextStop}
                {bus.etaMinutes > 0 ? ` · ${bus.etaMinutes} min` : ''}
              </Text>
            </View>
            <Badge
              label={bus.status === 'sos' ? 'SOS' : 'Live'}
              tone={bus.status === 'sos' ? 'danger' : 'success'}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  mapWrap: { flex: 1 },
  back: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  statusText: { flex: 1, paddingRight: 10 },
});

export default FullMapScreen;
