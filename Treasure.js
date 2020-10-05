import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-community/async-storage';
import * as Linking from 'expo-linking';



const digits = [5,9,3]
const songs = [
  { id:0,
    url:'https://open.spotify.com/track/4mvtqRJpySaswY75a9WfVm',
    song:'Vengo del Futuro'},
  { id:1,
    url:'https://open.spotify.com/track/0Snbzbd74RLfL0i4nn1vU5',
    song:'Favorito'},
  { id:2,
    url:'https://open.spotify.com/track/68ZVCePM9IP0MSbcmeZuup',
    song:'Laps Around The Sun'},
  { id:3,
    url:'https://open.spotify.com/track/1D4PL9B8gOg78jiHg3FvBb',
    song:'Love Story'}]

class Treasure extends React.Component {

  treasure = null;

  subs = [];

  state = {
    ready: true,
    activeMarker: 0
  };

  _storeData = async (activeMarker) => {
    try {
      await AsyncStorage.setItem('@activeMarker', activeMarker.toString());
      this.setState({activeMarker: activeMarker});
      console.log('Saved level ',activeMarker);
    } catch (error) {
      // Error saving data
    }
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('@activeMarker');
      if (value !== null) {
        // We have data!!
        this.setState({activeMarker: parseInt(value)})
        console.log('Retrieved level ',value);
      }
     } catch (error) {
       console.log(error);
     }
  }

  componentDidMount() {
    this.subs.push(this.props.navigation.addListener("focus", () =>
      this._retrieveData()
    ))
  }


  render() {

    return (
      <View style={styles.containerV} ref={ treasure => { this.treasure = treasure }}>
        <View style={styles.containerH}>
          {digits.map((digit, index) => {
            return (
                <Text key = {'treasure'+index} style = {{fontSize: 100}}>{index<this.state.activeMarker ? digit : '*'}</Text>
              );
            })
          }
        </View>
        <View alignItems = {'center'} marginBottom = {100} >
          <FontAwesome.Button
              name="spotify"
              style = {styles.button}
              onPress={()=>{Linking.openURL(songs[this.state.activeMarker].url)}}>
              {songs[this.state.activeMarker].song}
          </FontAwesome.Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerH: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  containerV: {
    flex: 1,
    justifyContent: 'center',
    
  },
  button: {
   backgroundColor:"#1DB954"

 }
});

export default Treasure;