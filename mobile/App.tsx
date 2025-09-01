import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './navigation/types';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './screens/LoginScreen';
import ChamadosScreen from './screens/ChamadosScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Chamados" component={ChamadosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
