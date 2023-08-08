//LIBRERIAS
import { StyleSheet} from 'react-native';
import 'react-native-gesture-handler';
import {  NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import  React from "react"


//SCREENS
import Importaciones from './screens/Importaciones'
import ProductosImportacion from './screens/ProductosImportacion'

import EscaneoBodega from './screens/EscaneoBodega';
import Home from './screens/Home';
import Bodega from './screens/Bodega';

const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={({ route, navigation }) => ({
           headerShown: false,
           gestureEnabled: true,
           ...TransitionPresets.SlideFromRightIOS,
       })}>
                <Stack.Screen name='Home' component={Home} />
                <Stack.Screen name='Bodega' component={Bodega} />
                <Stack.Screen name='Importaciones' component={Importaciones} />
                <Stack.Screen name='ProductosImportacion' component={ProductosImportacion} />

                <Stack.Screen name='EscaneoBodega' component={EscaneoBodega} />
        </Stack.Navigator>
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
