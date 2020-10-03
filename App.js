import React, { useState } from 'react';
import { Text, View, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import Map from './Map';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}

/*
const saveData = async (level) => {
  try {
    await AsyncStorage.setItem('@level_key', level.toString())
    alert('Data successfully saved '+level.toString())
    console.log('Data successfully saved ')

  } catch (e) {
    console.log('Error saving level value', e);
  }
}

const readData = async () => {
  try {
    const userLevel = await AsyncStorage.getItem('@level_key')
    alert('Successfully fetched the data from storage: '+userLevel)
    console.log('Successfully fetched the data from storage: '+userLevel)
    if (userLevel !== null) {
      console.log('not null '+Promise.resolve(userLevel))
      return Promise.resolve(userLevel)
    }
  } catch (e) {
    alert('Failed to fetch the data from storage')
    console.log(e)
  }
}
*/
function SettingsScreen() {
  
  //const data =  readData();
  //console.log(data);
  //let userLevel = data !== 'NaN' ? data: 0;
  //      <Button title={"Press "+userLevel} onPress={() => {/*saveData(Number.parseInt(userLevel,10)+1),*/ console.log('Ul: '+userLevel)}} />

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings</Text>
    </View>
  );
}



const Tab = createBottomTabNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName = 'Mapa'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Clave') {
              iconName = 'ios-key';
            } else if (route.name === 'Mapa') {
              iconName = 'ios-map';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'ios-list-box' : 'ios-list';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'skyblue',
          inactiveTintColor: 'gray',
          style: { height: 75},
          tabStyle: { marginTop: 5, marginBottom: -8}
        }}
      >
        <Tab.Screen name="Clave" component={HomeScreen} />
        <Tab.Screen name="Mapa" component={Map} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}