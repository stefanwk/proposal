import React from 'react';
import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import MapView from 'react-native-maps'

const LATITUDE_DELTA = 0.05;
const LONGITUDE_DELTA = 0.05;

const initialRegion = {
  latitude: -39.29,
  longitude: -72.15,
  latitudeDelta: 10,
  longitudeDelta: 10,
}
const markers = [{
    latitude:-39.296080,
    longitude: -72.145870,
    radius:100},
  {
    latitude: -39.287811,
    longitude: -72.226085,
    radius: 200
  }];

class MyMapView extends React.Component {

  map = null;

  state = {
    region: initialRegion,
    ready: true,
    activeMarker: 0,
    markers: markers
  };

  setRegion(region) {
    console.log(region);
    if(this.state.ready) {
      this.setState({region: region});
      this.map.animateToRegion(region,1000);
      //setTimeout(() => this.map.animateToRegion(region,2000), 10);
    }
    //this.setState({ region });
  }

  componentDidMount() {
    this.getCurrentPosition();
  }

  getCurrentPosition = () => {
    try {
      //this.setRegion(this.state.region);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          };
          this.setRegion(region);
        },
        (error) => {
          //TODO: better design
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Privacidad - Localización");
              } else {
                Alert.alert("", "Para ubicar tu locación habilita permiso para la aplicación en Ajustes - Apps - ExampleApp - Localización");
              }
              break;
            default:
              Alert.alert("", "Error al detectar tu locación");
              console.log(error);
          }
        }
      );
    } catch(e) {
      alert(e.message || "");
    }
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
    console.log('onRegionChangeComplete', region);
  };

  render() {

    const { region } = this.state;
    const { children, renderMarker, markers } = this.props;
    console.log(this.props);

    return (
      <View style={styles.container}>
        
        <MapView
          showsUserLocation
          userLocationAnnotationTitle={'Ubicación actual'}

          ref={ map => { this.map = map }}
          //data={markers}
          initialRegion={initialRegion}
          renderMarker={renderMarker}
          onMapReady={this.onMapReady}
          showsMyLocationButton={true}
          //onRegionChange={this.onRegionChange}
          //onRegionChangeComplete={this.onRegionChangeComplete}
          style={StyleSheet.absoluteFill}
          textStyle={{ color: '#bc8b00' }}
          containerStyle={{backgroundColor: 'white', borderColor: '#BC8B00', }}>

          {!this.state.ready ? null : this.state.markers.map((marker, index) => {
            const coords = {
            latitude: marker.latitude,
            longitude: marker.longitude,
            };

            const metadata = `Status: ${index}`;

            return (
              <React.Fragment>
                <MapView.Marker
                  key={'Marker'+index}
                  coordinate={coords}
                  //>title={marker.stationName}
                  description={metadata}
                />
                <MapView.Circle
                  key={'Cicle'+index}
                  center={coords}
                  radius={marker.radius}
                  strokeColor='rgb(12, 183, 242)'
                  fillColor='rgba(12, 183, 242, 0.5)'
                />
              </React.Fragment>
            );
          })}
        </MapView>
        <TouchableOpacity style={styles.button} activeOpacity = "0.9" onPress={this.getCurrentPosition}>
          <FontAwesome name="location-arrow" size={20} color="white"/>
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
   marginBottom: 30
 }
});

export default MyMapView;