import React, { useState } from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps'
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import AsyncStorage from '@react-native-community/async-storage';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


const LATITUDE_DELTA = 0.005;
const LONGITUDE_DELTA = 0.005;

const initialRegion = {
  latitude: -39.29,
  longitude: -72.15,
  latitudeDelta: 10,
  longitudeDelta: 10,
}
let markers = [{
    latitude:-39.296080,
    longitude: -72.145870,
    radius:100,
    id: 1,
    entered: false
  },
  {
    latitude: -39.287811,
    longitude: -72.226085,
    radius: 200,
    id: 2,
    entered: false
  }];

const LOCATION_SETTINGS = {
  accuracy: Location.Accuracy.High,
  timeInterval: 2000,
  distanceInterval: 10,
};


class MyMapView extends React.Component {

  map = null;

  subs = [];

  state = {
    region: initialRegion,
    location: null,
    ready: true,
    activeMarker: 0,
    markers: markers
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
       // Error retrieving data
     }
  }

  setRegion(region,animate) {
    if(this.state.ready) {
      this.setState({region: region});
      animate ? this.animateRegion(region) : null;
      //setTimeout(() => this.map.animateToRegion(region,2000), 10);
    }
    //this.setState({ region });
  }

  animateRegion = async () => {
    console.log('animating');
    let position = await Location.getLastKnownPositionAsync();
    const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };

    this.map.animateToRegion(region,1000);
  }

  componentWillUnmount() {
    try{
      this.mounted = false;
      this.subs.forEach(sub => {console.log(sub);sub.remove()});
    } catch (error) {
       console.log('Error: ',error);
     }
  }


  componentDidMount() {
    this.mounted = true;
    this._getLocationAsync(true);
    this.subscribeWatchPosition();
    this.subs.push(this.props.navigation.addListener("focus", () =>
      this._retrieveData()
    ))
  }

  subscribeWatchPosition = async () => {

    this.subs.push(await Location.watchPositionAsync(LOCATION_SETTINGS, location => {
      this.setState((state, props) => {
        const now = Date.now();
        console.log('Location Auto-Update');
        return {
          ...state,
          location,
          prevTime: now,
          timeDiff: now - state.prevTime,
        };
      });
      this.checkCircle();
    }))

  }

  checkCircle() {

    if (this.state.location){

      this.state.markers.map((marker, index) => {
        const markerCoords = [marker.latitude, marker.longitude];
        const positionCoords = [this.state.location.coords.latitude, this.state.location.coords.longitude];

        let distance = this.computeDistance(markerCoords, positionCoords);
        if(index === this.state.activeMarker && distance < marker.radius){
          marker.entered = true;
          this._storeData(marker.id);
        }

        console.log('Marker '+marker.id, ' distance: '+distance, 'level: '+this.state.activeMarker);

      })
    }
  }

  computeDistance = ([prevLat, prevLong], [lat, long]) => {
    const prevLatInRad = this.toRad(prevLat);
    const prevLongInRad = this.toRad(prevLong);
    const latInRad = this.toRad(lat);
    const longInRad = this.toRad(long);

    return (
      // In meters
      6377.830272 * 1000 *
      Math.acos(
        Math.sin(prevLatInRad) * Math.sin(latInRad) +
          Math.cos(prevLatInRad) * Math.cos(latInRad) * Math.cos(longInRad - prevLongInRad),
      )
    );
  }

  toRad = (angle) => {
    return (angle * Math.PI) / 180;
  }

  _getLocationAsync = async (animate) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });
    console.log('Location Manual-Update');
    animate ? this.animateRegion() : null
  };

  onMapReady = (e) => {
    if(!this.state.ready) {
      this.setState({ready: true});
    }
  };

  onRegionChange = (region) => {
    console.log('onRegionChange', region);
  };

  onRegionChangeComplete = (region) => {
    console.log('onRegionChangeComplete', region.longitudeDelta, this.state.region.longitudeDelta);
  };

  render() {

    const { region } = this.state;
    const { children, renderMarker, markers } = this.props;

    return (
      <View style={styles.container}>
        
        <MapView
          key = 'Mapview1'
          showsUserLocation
          followsUserLocation
          userLocationAnnotationTitle={'Ubicación actual'}

          ref={ map => { this.map = map }}
          //data={markers}
          initialRegion={initialRegion}
          renderMarker={renderMarker}
          onMapReady={this.onMapReady}
          showsMyLocationButton={true}
          //onRegionChange={this.onRegionChange}
          //>onRegionChangeComplete={this.onRegionChangeComplete}
          style={StyleSheet.absoluteFill}
          textStyle={{ color: '#bc8b00' }}
          containerStyle={{backgroundColor: 'white', borderColor: '#BC8B00', }}>

          {!this.state.ready ? null : this.state.markers.map((marker, index) => {
            const coords = {
            latitude: marker.latitude,
            longitude: marker.longitude,
            };

            const metadata = `Status: ${index}`;

            if(marker.id<=this.state.activeMarker+1){

              return (
                <React.Fragment key = {'Fragment'+marker.id}>
                  <MapView.Marker
                    key={'Marker'+marker.id}
                    coordinate={coords}
                    //>title={marker.stationName}
                    description={metadata}
                  />
                  <MapView.Circle
                    key={'Cicle'+marker.id}
                    center={coords}
                    radius={marker.radius}
                    strokeColor='rgb(12, 183, 242)'
                    fillColor={marker.id<=this.state.activeMarker ? 'rgba(11, 156, 49, 0.8)' : 'rgba(12, 183, 242, 0.5)'}
                  />
                </React.Fragment>
              );
            }
          })}
        </MapView>
        <TouchableOpacity key = 'boton' style={styles.button} activeOpacity = "0.9" onPress={() => this.animateRegion()}>
          <FontAwesome key = 'icono' name="location-arrow" size={20} color="white"/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  button: {
   alignItems:'center',
   justifyContent:'center',
   width:50,
   height:50,
   backgroundColor:'skyblue',
   borderRadius:50,
   marginRight: 10,
   marginBottom: 100
 }
});

export default MyMapView;