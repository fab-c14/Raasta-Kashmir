import React from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

interface BrandMarkProps {
  size?: number;
}

/**
 * The Raasta Kashmir logo as an SVG: a bus riding a curved road crest with a
 * dashed centre line ("raasta" = road). Same mark as the app icon, usable
 * anywhere in the UI at any size.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({ size = 72 }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Defs>
      <LinearGradient id="raastaBg" x1="0" y1="0" x2="1" y2="1">
        <Stop offset="0" stopColor="#16A34A" />
        <Stop offset="1" stopColor="#22C55E" />
      </LinearGradient>
    </Defs>
    <Rect x="0" y="0" width="100" height="100" rx="24" fill="url(#raastaBg)" />
    {/* Road crest */}
    <Path d="M -30 118 A 82 82 0 0 1 130 118 Z" fill="#FFFFFF" opacity={0.22} />
    <Path
      d="M -14 108 A 74 74 0 0 1 114 108"
      stroke="#FFFFFF"
      strokeWidth={2}
      strokeDasharray="5 4"
      fill="none"
      opacity={0.9}
    />
    {/* Bus */}
    <Rect x="42" y="19" width="16" height="6.5" rx="3.2" fill="#FFFFFF" />
    <Rect x="29.5" y="26.5" width="41" height="39" rx="6.5" fill="#FFFFFF" />
    <Rect x="34" y="31.5" width="32" height="14.5" rx="3.4" fill="#15803D" />
    <Rect x="43.5" y="52.5" width="13" height="2.4" rx="1.2" fill="#15803D" />
    <Rect x="43.5" y="56.5" width="13" height="2.4" rx="1.2" fill="#15803D" />
    <Circle cx="37" cy="55.5" r="3.2" fill="#F59E0B" />
    <Circle cx="63" cy="55.5" r="3.2" fill="#F59E0B" />
    <Rect x="26.5" y="63.5" width="47" height="5" rx="2.5" fill="#FFFFFF" />
    <Circle cx="37.5" cy="71.5" r="5.4" fill="#141B2D" />
    <Circle cx="62.5" cy="71.5" r="5.4" fill="#141B2D" />
    <Circle cx="37.5" cy="71.5" r="2.2" fill="#FFFFFF" />
    <Circle cx="62.5" cy="71.5" r="2.2" fill="#FFFFFF" />
  </Svg>
);
