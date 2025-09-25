import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorageExemplo from './components/AsyncStorageExemplo';
import HomeScreen from './components/HomeScreen';
import DataScreen from './components/DataScreen';

const stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <stack.Navigator initialRoute='Home'>
        <stack.Screen name='Home' component={HomeScreen}/>
        <stack.Screen name='Data' component={DataScreen}/>
      </stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
