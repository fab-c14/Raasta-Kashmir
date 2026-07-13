import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import DashboardStubScreen from '../screens/DashboardStubScreen';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {user?.role === 'driver' && (
        <Stack.Screen name="DriverDashboard" component={DashboardStubScreen} />
      )}
      {user?.role === 'parent' && (
        <Stack.Screen name="ParentDashboard" component={DashboardStubScreen} />
      )}
      {user?.role === 'school' && (
        <Stack.Screen name="SchoolDashboard" component={DashboardStubScreen} />
      )}
      {user?.role === 'rto' && (
        <Stack.Screen name="RTODashboard" component={DashboardStubScreen} />
      )}
    </Stack.Navigator>
  );
};
