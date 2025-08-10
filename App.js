import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Context
import { AuthProvider, useAuth } from './contexts1/AuthContext';
import { navigationRef } from './contexts1/NavigationService';
import { PostProvider } from './contexts1/PostContext';

// Screens
import BottomTabNavigator from './screens/BottomTabNavigator';
import ChangeEmailScreen from './screens/ChangeEmail';
import ChangeEmailVerificationScreen from './screens/ChangeEmailVerificationScreen';
import ChangePasswordScreen from './screens/ChangePassword';
import ChatUserScreen from './screens/ChatUserScreen';
import ConfirmNewEmailVerificationScreen from './screens/ConfirmNewEmailVerificationScreen';
import ConfirmVerificationScreen from './screens/ConfirmVerificationScreen';
import CreateAPostScreen from './screens/CreateAPostScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import LoginScreen from './screens/LoginScreen';
import NewEmailScreen from './screens/NewEmailScreen';
import PostPage from './screens/PostPage';
import ResetPasswordScreen from './screens/ResetPasswordScreen';
import SettingsScreen from './screens/SettingsScreen';
import SignUpScreen from './screens/SignUpScreen';
import TermsAndPrivacyScreen from './screens/TermsAndPrivacyScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import VerificationScreen from './screens/VerificationScreen';


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
        <Stack.Screen name="ChatScreen" component={ChatUserScreen} />

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
