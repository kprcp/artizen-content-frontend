import { createStackNavigator } from '@react-navigation/stack';
import SearchScreen from './SearchScreen';  // ✅ Correct
import UserProfileScreen from './UserProfileScreen';

const Stack = createStackNavigator();

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
    <Stack.Screen name="UserProfileScreen" component={UserProfileScreen} />
  </Stack.Navigator>
);

export default SearchStack;
