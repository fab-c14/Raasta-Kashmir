import React from 'react';
import { BellOff } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { ScreenHeader } from '../../components/ui/ScreenHeader';
import { EmptyState } from '../../components/ui/EmptyState';
import { AlertListItem } from '../../components/AlertListItem';
import { useAuth } from '../../context/AuthContext';
import { useBusTracking } from '../../hooks/useBusTracking';
import { DEMO_BUS_NO } from '../../constants/demoRoute';

const ParentAlertsScreen: React.FC = () => {
  const { user } = useAuth();
  const { events } = useBusTracking(user?.assignedBusNo ?? DEMO_BUS_NO);

  return (
    <ScreenContainer>
      <ScreenHeader title="Alerts" subtitle="Realtime safety notifications for your bus" />
      {events.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="No alerts yet"
          message="Overspeeding, long stops, route deviations and SOS alerts will appear here in real time."
        />
      ) : (
        events.map((event) => <AlertListItem key={event.id} event={event} />)
      )}
    </ScreenContainer>
  );
};

export default ParentAlertsScreen;
