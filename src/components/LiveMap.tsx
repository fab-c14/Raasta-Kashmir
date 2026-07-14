import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MapView, { Circle, Details, Marker, Polyline, Region } from 'react-native-maps';
import { Bus, MapPin, Maximize2 } from 'lucide-react-native';
import { LatLng } from '../types/trip';
import { DEMO_REGION, DEMO_ROUTE_PATH, DEMO_STOPS } from '../constants/demoRoute';
import { useAppTheme } from '../hooks/useAppTheme';

interface LiveMapProps {
  busLocation: LatLng | null;
  heading?: number;
  height?: number;
  followBus?: boolean;
  /** Highlights the parent's chosen pickup stop. */
  pickupLocation?: LatLng | null;
  /** Shows an expand button that opens the full-screen map. */
  onExpand?: () => void;
}

/** How long the camera leaves the map alone after the user pans or zooms. */
const GESTURE_GRACE_MS = 12_000;

/** Shared map: real road route, stops, live bus, optional pickup point. */
export const LiveMap: React.FC<LiveMapProps> = ({
  busLocation,
  heading = 0,
  height = 300,
  followBus = true,
  pickupLocation = null,
  onExpand,
}) => {
  const { colors, roundness, isDark, shadows } = useAppTheme();
  const mapRef = useRef<MapView | null>(null);
  const lastGestureAt = useRef(0);
  const hasCentered = useRef(false);

  useEffect(() => {
    if (!busLocation || !followBus) return;
    // Respect the user's gestures: pause auto-follow after a pan/zoom, and
    // never override their zoom level — only recenter.
    if (Date.now() - lastGestureAt.current < GESTURE_GRACE_MS) return;
    if (!hasCentered.current) {
      hasCentered.current = true;
      mapRef.current?.animateCamera({ center: busLocation, zoom: 14 }, { duration: 800 });
    } else {
      mapRef.current?.animateCamera({ center: busLocation }, { duration: 900 });
    }
  }, [busLocation, followBus]);

  const handleRegionChange = (_region: Region, details: Details): void => {
    if (details.isGesture) lastGestureAt.current = Date.now();
  };

  return (
    <View style={[styles.wrap, { height, borderRadius: roundness.lg, borderColor: colors.border }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEMO_REGION}
        onRegionChangeComplete={handleRegionChange}
        showsCompass={false}
        toolbarEnabled={false}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
      >
        <Polyline coordinates={DEMO_ROUTE_PATH} strokeColor={colors.primary} strokeWidth={4} />
        {DEMO_STOPS.map((stop) => (
          <Circle
            key={stop.name}
            center={stop.location}
            radius={80}
            strokeColor={colors.primaryDark}
            fillColor={`${colors.primary}33`}
          />
        ))}
        {pickupLocation ? (
          <Marker coordinate={pickupLocation} anchor={{ x: 0.5, y: 1 }}>
            <View style={[styles.pickupMarker, { backgroundColor: colors.warning }]}>
              <MapPin size={15} color="#FFFFFF" strokeWidth={2.4} />
            </View>
          </Marker>
        ) : null}
        {busLocation ? (
          <Marker coordinate={busLocation} rotation={heading} anchor={{ x: 0.5, y: 0.5 }} flat>
            <View style={[styles.busMarker, { backgroundColor: colors.primary }]}>
              <Bus size={16} color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </Marker>
        ) : null}
      </MapView>
      {onExpand ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Open full map"
          onPress={onExpand}
          style={[styles.expand, shadows.sm, { backgroundColor: colors.card }]}
        >
          <Maximize2 size={16} color={colors.textPrimary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  busMarker: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pickupMarker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  expand: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
