// screens/WorldStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WorldScreen from './WorldScreen';
import NotificationsScreen from './NotificationsScreen';

const Stack = createNativeStackNavigator();

const WorldStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="WorldScreen" component={WorldScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
};

export default WorldStack;