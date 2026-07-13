import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

interface BrandMarkProps {
  size?: number;
}

/**
 * The Raasta Kashmir logo: snow-capped valley peaks with the road ("raasta")
 * winding down to the school bus. Same artwork as the app icon, rendered as
 * SVG for use anywhere in the UI.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 72 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="raastaSky" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0" stopColor="#16A34A" />
        <Stop offset="1" stopColor="#34D367" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" rx="24" fill="url(#raastaSky)" />
    {/* Sun */}
    <Circle cx="83" cy="17" r="6" fill="#FFFFFF" opacity={0.92} />
    {/* Right peak */}
    <Path d="M 45 74 L 72 29 L 106 74 Z" fill="#0E7A39" />
    <Path d="M 66 40 L 72 29 L 78.5 40 L 75 37.3 L 72 40.2 L 69 37.3 Z" fill="#FFFFFF" />
    {/* Left peak */}
    <Path d="M -7 76 L 32 23 L 71 76 Z" fill="#0B642F" />
    <Path d="M 24.5 33.8 L 32 23 L 39.8 33.8 L 36 30.8 L 32 34.2 L 28 30.8 Z" fill="#FFFFFF" />
    {/* Winding road */}
    <Path
      d="M 34 104 C 30 85, 58.5 77, 50 63 L 56.5 63 C 71 76, 66.5 87, 68.5 104 Z"
      fill="#FFFFFF"
      opacity={0.5}
    />
    <Path
      d="M 51.5 104 C 48.5 86.5, 63 77.5, 53.2 64"
      stroke="#FFFFFF"
      strokeWidth={1.6}
      strokeDasharray="3 2.6"
      fill="none"
      opacity={0.92}
    />
    {/* Bus */}
    <Rect x="46" y="60.5" width="8.4" height="3.3" rx="1.6" fill="#FFFFFF" />
    <Rect x="39.4" y="64.4" width="21.4" height="20.4" rx="3.4" fill="#FFFFFF" />
    <Rect x="41.7" y="67" width="16.8" height="7.6" rx="1.8" fill="#15803D" />
    <Rect x="46.8" y="77.9" width="6.6" height="1.3" rx="0.65" fill="#15803D" />
    <Rect x="46.8" y="80" width="6.6" height="1.3" rx="0.65" fill="#15803D" />
    <Circle cx="43.5" cy="79.3" r="1.7" fill="#F59E0B" />
    <Circle cx="56.7" cy="79.3" r="1.7" fill="#F59E0B" />
    <Rect x="37.9" y="83.6" width="24.4" height="2.7" rx="1.35" fill="#FFFFFF" />
    <Circle cx="43.5" cy="87.6" r="2.8" fill="#141B2D" />
    <Circle cx="56.6" cy="87.6" r="2.8" fill="#141B2D" />
    <Circle cx="43.5" cy="87.6" r="1.1" fill="#FFFFFF" />
    <Circle cx="56.6" cy="87.6" r="1.1" fill="#FFFFFF" />
  </Svg>
);
