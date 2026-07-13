import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Bell, FileWarning, History, Home, LucideIcon, MessageSquareWarning, Trophy, User } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { useAppTheme } from '../hooks/useAppTheme';
import { fontFamilies } from '../theme/typography';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import ParentHomeScreen from '../screens/parent/ParentHomeScreen';
import ParentAlertsScreen from '../screens/parent/ParentAlertsScreen';
import SchoolDashboardScreen from '../screens/school/SchoolDashboardScreen';
import SchoolComplaintsScreen from '../screens/school/SchoolComplaintsScreen';
import SchoolRankingsScreen from '../screens/school/SchoolRankingsScreen';
import RtoDashboardScreen from '../screens/rto/RtoDashboardScreen';
import RtoViolationsScreen from '../screens/rto/RtoViolationsScreen';
import TripHistoryScreen from '../screens/shared/TripHistoryScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';

interface TabScreen {
  name: string;
  component: React.ComponentType;
  label: string;
  icon: LucideIcon;
}

const Tab = createBottomTabNavigator();

const tabsForRole: Record<string, TabScreen[]> = {
  driver: [
    { name: 'DriverHome', component: DriverHomeScreen, label: 'Home', icon: Home },
    { name: 'TripHistory', component: TripHistoryScreen, label: 'History', icon: History },
    { name: 'Profile', component: ProfileScreen, label: 'Profile', icon: User },
  ],
  parent: [
    { name: 'ParentHome', component: ParentHomeScreen, label: 'Track', icon: Home },
    { name: 'Alerts', component: ParentAlertsScreen, label: 'Alerts', icon: Bell },
    { name: 'Profile', component: ProfileScreen, label: 'Profile', icon: User },
  ],
  school: [
    { name: 'SchoolHome', component: SchoolDashboardScreen, label: 'Fleet', icon: Home },
    { name: 'Complaints', component: SchoolComplaintsScreen, label: 'Complaints', icon: MessageSquareWarning },
    { name: 'Rankings', component: SchoolRankingsScreen, label: 'Rankings', icon: Trophy },
    { name: 'Profile', component: ProfileScreen, label: 'Profile', icon: User },
  ],
  rto: [
    { name: 'RtoHome', component: RtoDashboardScreen, label: 'Compliance', icon: Home },
    { name: 'Violations', component: RtoViolationsScreen, label: 'Violations', icon: FileWarning },
    { name: 'Profile', component: ProfileScreen, label: 'Profile', icon: User },
  ],
};

export const RoleTabs: React.FC = () => {
  const { user } = useAuth();
  const { colors } = useAppTheme();
  const tabs = tabsForRole[user?.role ?? 'parent'] ?? tabsForRole.parent;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 64,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontFamily: fontFamilies.medium, fontSize: 11, paddingBottom: 8 },
      }}
    >
      {tabs.map(({ name, component, label, icon: Icon }) => (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          options={{
            tabBarLabel: label,
            tabBarIcon: ({ color }) => <Icon size={21} color={color} strokeWidth={2} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};
