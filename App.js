import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Context
import { PostProvider } from './contexts1/PostContext';
import { AuthProvider, useAuth } from './contexts1/AuthContext';
import { navigationRef } from './contexts1/NavigationService';

// Screens
import SignUpScreen from './screens/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import TermsAndPrivacyScreen from './screens/TermsAndPrivacyScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import CreateAPostScreen from './screens/CreateAPostScreen';
import SettingsScreen from './screens/SettingsScreen';
import ChangePasswordScreen from './screens/ChangePassword';
import ChangeEmailScreen from './screens/ChangeEmail';
import ChangeEmailVerificationScreen from './screens/ChangeEmailVerificationScreen';
import PostPage from './screens/PostPage';
import BottomTabNavigator from './screens/BottomTabNavigator';
import VerificationScreen from './screens/VerificationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ConfirmVerificationScreen from './screens/ConfirmVerificationScreen';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import NewEmailScreen from './screens/NewEmailScreen';
import ConfirmNewEmailVerificationScreen from './screens/ConfirmNewEmailVerificationScreen';
import UserProfileScreen from './screens/UserProfileScreen';

const Stack = createStackNavigator();

// ✅ Dynamic Navigator wrapper
const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a splash screen

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName={user ? 'MainApp' : 'SignUpScreen'}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="ConfirmVerificationScreen" component={ConfirmVerificationScreen} />
        <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen name="TermsAndPrivacyScreen" component={TermsAndPrivacyScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="CreateAPostScreen" component={CreateAPostScreen} />
        <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
        <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
        <Stack.Screen name="ChangeEmailScreen" component={ChangeEmailScreen} />
        <Stack.Screen name="ChangeEmailVerificationScreen" component={ChangeEmailVerificationScreen} />
        <Stack.Screen name="NewEmailScreen" component={NewEmailScreen} />
        <Stack.Screen name="ConfirmNewEmailVerificationScreen" component={ConfirmNewEmailVerificationScreen} />
        <Stack.Screen name="PostPage" component={PostPage} />
        <Stack.Screen name="MainApp" component={BottomTabNavigator} />
        <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ✅ Wrap everything with providers
export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppNavigator />
      </PostProvider>
    </AuthProvider>
  );
}
