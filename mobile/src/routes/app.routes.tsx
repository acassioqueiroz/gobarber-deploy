import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dasbboard from '../pages/Dashboard';

const Auth = createStackNavigator();

const AppRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#312e38',
      },
    }}
  >
    <Auth.Screen name="SignIn" component={Dasbboard} />
  </Auth.Navigator>
);

export default AppRoutes;
