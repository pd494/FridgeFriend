import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './AuthContext';
import Login from './screens/Login';
import Index from './screens/Index';
import ItemModal from './screens/AddItemModal';
import CameraModal from './components/CameraModal';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Group>
            <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
            <Stack.Screen name='Index' component={Index} />
          </Stack.Group>
           <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name="ItemModal" component={ItemModal} />
              <Stack.Screen name = 'Camera' component = {CameraModal}></Stack.Screen>

        </Stack.Group>

        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

