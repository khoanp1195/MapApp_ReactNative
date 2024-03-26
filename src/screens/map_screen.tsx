import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, Modal, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNFS, { readFile } from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";

export const MapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [markerInfo, setMarkerInfo] = useState({});
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(false)
  let loadingTimeout;

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles]
      });
      const fileContent = await readFile(res[0].uri, 'ascii');
      const wb = XLSX.read(fileContent, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);

      const mapData = data.map((item: any) => ({
        coordinate: {
          latitude: item.Latitude,
          longitude: item.Longitude,
        },
        title: item.ShopName || 'Unnamed Marker',
        description: item.Street,
        NumOfHouse: item.NumOfHouse,
        ShopCode: item.ShopCode,
        ProvinceId: item.ProvinceId,
        DistrictId: item.DistrictId,
        WardId: item.WardId
      }));
      setMarkers(mapData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      loadingTimeout = setTimeout(() => {
        setLoading(false);
      }, 5000);
    }
  };

  const ClearData = () => {
    setMarkers([]);
  }

  const handleMarkerPress = (marker: any) => {
    setSelectedMarker(marker);
    setMarkerInfo(marker);
    setModalVisible(true);
  };

  const handleSaveInfo = () => {
    setMarkers((prevMarkers: any) => {
      return prevMarkers.map((m: any) => {
        if (m.id === selectedMarker.id) {
          return { ...m, ...markerInfo };
        }
        return m;
      });
    });
    setModalVisible(false);
  };

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position: { coords: { latitude: any; longitude: any; }; }) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
      },
      (error: any) => {
        console.error('Error getting current position:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const handleMoveToCurrentLocation = () => {
    getCurrentPosition();
  };

  const haversine = (lat1: any, lon1: any, lat2: any, lon2: any) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d;
  };

  const calculateDistance = (currentLat: any, currentLon: any, markerLat: any, markerLon: any) => {
    return haversine(currentLat, currentLon, markerLat, markerLon);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <TouchableOpacity style={styles.icon_attach} onPress={() => {
        fetchData()
      }}>
        <Image
          source={require("../assets/images/attach_file.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        handleMoveToCurrentLocation()
      }} style={styles.icon_position}>
        <Image
          source={require("../assets/images/location.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon_reload} onPress={() => {
        ClearData()
      }}>
        <Image
          source={require("../assets/images/reload.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <MapView style={{ flex: 1 }} region={{
        latitude: currentPosition ? currentPosition.latitude : 37.78825,
        longitude: currentPosition ? currentPosition.longitude : -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
        {markers.map((marker: any) => (
          <Marker key={marker.title} coordinate={marker.coordinate} onPress={() => handleMarkerPress(marker)}>
            <Callout>
              <View style={{ padding: 10 }}>
                <Text style={{ fontWeight: '600' }}>{marker.title}</Text>
                {marker.ShopCode && <Text>Mã CH: {marker.ShopCode}</Text>}
                {marker.description && (
                  <Text>
                    Địa chỉ: {marker.description}, {marker.NumOfHouse}
                  </Text>
                )}
                {marker.NumOfHouse && <Text>Cách: {calculateDistance(currentPosition.latitude, currentPosition.longitude, marker.coordinate.latitude, marker.coordinate.longitude)} km</Text>}
              </View>
            </Callout>
          </Marker>
        ))}
        {currentPosition && (
          <Marker
            coordinate={{
              latitude: currentPosition.latitude,
              longitude: currentPosition.longitude,
            }}
            title="Current Position"
          />
        )}
      </MapView>
      {/* <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <Text>Edit Marker Info</Text>
            <TextInput
              value={markerInfo.description}
              onChangeText={(text) => setMarkerInfo({ ...markerInfo, title: text })}
            />
            <TouchableOpacity style={{ width: 100, height: 50, marginTop: 50, backgroundColor: 'blue', justifyContent: 'center' }} onPress={handleSaveInfo}>
              <Text style={{ alignSelf: 'center' }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal> */}
      {loading && <View style={styles.dotsWrapper}>
        <ActivityIndicator
          color={'#006885'} size={25} />
        <Text>Loading...</Text>
      </View>

      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  icon: {
    width: 50,
    height: 50
  },
  dotsWrapper: {
    height: 100,
    justifyContent: 'center',
    marginTop: '60%',
    position: 'absolute',
    alignSelf: 'center',

    zIndex: 1
  },
  loading: {
    width: 100,
    height: 100,
    borderRadius: 30,
    zIndex: 1,
    position: 'absolute',
    top: 100,
    left: '20%',
    top: '50%',
  },
  icon_attach: {
    width: 50,
    height: 50,
    borderRadius: 30,
    zIndex: 1,
    position: 'absolute',
    top: 100,
    left: '84%',
    top: '73%',
  },
  icon_position: {
    width: 50,
    height: 50,
    borderRadius: 30,
    zIndex: 1,
    position: 'absolute',
    top: 100,
    left: '84%',
    top: '80%',
  },
  icon_reload: {
    width: 50,
    height: 50,
    borderRadius: 30,
    zIndex: 1,
    position: 'absolute',
    top: 100,
    left: '84%',
    top: '87%',
  }
});
