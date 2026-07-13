import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import { Bus } from 'lucide-react-native';
import { LatLng } from '../types/trip';
import { DEMO_REGION, DEMO_ROUTE_PATH, DEMO_STOPS } from '../constants/demoRoute';
import { useAppTheme } from '../hooks/useAppTheme';

interface LiveMapProps {
  busLocation: LatLng | null;
  heading?: number;
  height?: number;
  followBus?: boolean;
}

/** Shared map: planned route, stops, and the live bus marker. */
export const LiveMap: React.FC<LiveMapProps> = ({
  busLocation,
  heading = 0,
  height = 300,
  followBus = true,
}) => {
  const { colors, roundness, isDark } = useAppTheme();
  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    if (busLocation && followBus) {
      mapRef.current?.animateCamera(
        { center: busLocation, zoom: 14 },
        { duration: 900 }
      );
    }
  }, [busLocation, followBus]);

  return (
    <View style={[styles.wrap, { height, borderRadius: roundness.lg, borderColor: colors.border }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={DEMO_REGION}
        showsCompass={false}
        toolbarEnabled={false}
        userInterfaceStyle={isDark ? 'dark' : 'light'}
      >
        <Polyline
          coordinates={DEMO_ROUTE_PATH}
          strokeColor={colors.primary}
          strokeWidth={4}
          lineDashPattern={[1]}
        />
        {DEMO_STOPS.map((stop) => (
          <Circle
            key={stop.name}
            center={stop.location}
            radius={90}
            strokeColor={colors.primaryDark}
            fillColor={`${colors.primary}33`}
          />
        ))}
        {busLocation ? (
          <Marker coordinate={busLocation} rotation={heading} anchor={{ x: 0.5, y: 0.5 }} flat>
            <View style={[styles.busMarker, { backgroundColor: colors.primary }]}>
              <Bus size={16} color="#FFFFFF" strokeWidth={2.2} />
            </View>
          </Marker>
        ) : null}
      </MapView>
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
});
