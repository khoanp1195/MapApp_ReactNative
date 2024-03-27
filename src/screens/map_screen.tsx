import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNFS, { readFile } from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';
import MapView, { Marker, Callout } from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";
import { MapData } from "../services/database/models/MapData";
import { values } from "@nozbe/watermelondb/utils/fp";
import React from "react";
import { Keyboard } from 'react-native';

export const MapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(false)
  const [markersLocal, setmarkersLocal] = useState([])
  const [isAttachFile, setisAttachFile] = useState(false)
  const [searchKey, setSearchKey] = useState("")
  const [titleKey, settitleKey] = useState("")
  const [filteredData, setFilteredData] = useState([]);
  let loadingTimeout;

    //@ts-ignore
    const Item = ({ item, index }) => {
      return (
          <Pressable style={{
              backgroundColor: 'white',
              flex: 1,
              flexDirection: 'row',
              padding: 10,
          }}
              //@ts-ignore
              onPress={() => { onClickUnit(item) }}
          >
              <View style={{ flex: 1, flexDirection: 'row' }}>
                  <Text>{item.title}</Text>
              </View >
          </Pressable >
      )
  }
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
        latitude: item.Latitude,
        longitude: item.Longitude,
        title: item.ShopName || 'Unnamed Marker',
        description: item.Street,
        NumOfHouse: item.NumOfHouse,
        ShopCode: item.ShopCode,
        ProvinceId: item.ProvinceId,
        DistrictId: item.DistrictId,
        WardId: item.WardId
      }));
      setisAttachFile(true)
       await getDataMapLocal(mapData)
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setisAttachFile(false)
    }
  };

  const getDataMapLocal = async (data:any) =>{ 
    MapData.insertOrUpdateAll(data).then(() =>{
      return MapData.getAll(10)
    } )
  }

  const ClearData = () => {
    setmarkersLocal([])
  }

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MapData.getAll(10);
        setmarkersLocal(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [isAttachFile]);

  useEffect(() =>{
    const filtered = markersLocal.filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()));
    setFilteredData(filtered);
  },[searchKey,markersLocal])

  const handleMapViewPress = () => {
    Keyboard.dismiss();
  };

  const handleSave = async (markerId: any, title:string) => {
    try {
      const retrievedMarker = await MapData.getMapByShopCode(markerId);
      if (!retrievedMarker) {
        return;
      }
      retrievedMarker.map((marker: any) =>{
        marker.title = title
      })
      await MapData.insertOrUpdateAll(retrievedMarker).then(() =>{
        Alert.alert('Thông báo', 'Dữ liệu đã được cập nhật', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
        setmarkersLocal(retrievedMarker)
      } )
    } catch (error) {
      Alert.alert('Thông báo', 'Không thể cập nhật dữ liệu', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
              <View style={{
                height: 60,
                justifyContent: 'center',
                alignItems: 'center',
                width:'90%',
                zIndex: 1,
                position: 'absolute',
                left:'5%',
                borderRadius:30,
                top:'2%'
            }}>
                <View style={styles.searchBar}>
                    <Image
                        style={{
                            // flex: 1,
                            height: '40%',
                            aspectRatio: 1,
                            marginLeft: 10,
                            justifyContent: 'center',
                            // backgroundColor: 'cyan'
                        }}
                        source={require('../assets/images/icon_search26.png')}
                        resizeMode="stretch"
                    />
                    < TextInput
                        style={styles.input}
                        placeholder="Tìm kiếm"
                        autoCapitalize="none"
                        value={searchKey}
                        onChangeText={(text) => setSearchKey(text)} />
                </View>

            </View>
            {
              searchKey.length > 1 && filteredData != null && filteredData.length > 0 ?
                    <View style={{
                        flex: 1,
                        top:'10%',
                        width:'90%',
                        zIndex: 1,
                        position: 'absolute',
                        borderRadius:10,
                        left:'5%',
                        height: 260,
                    }}>
                        <FlatList
                            scrollEnabled={true}
                            // @ts-ignore
                            keyExtractor={(item, index) => item + index}
                            data={filteredData}
                            numColumns={1}
                            // @ts-ignore
                            renderItem={({ item, index }) => {
                                return <Item item={item} index={index} />;
                            }}
                        />
                    </View>
                    : null
            }

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

      <MapView style={{ flex: 1 }} 
      onPress={handleMapViewPress}
      region={{
        latitude: currentPosition ? currentPosition.latitude :  10.8231,
        longitude: currentPosition ? currentPosition.longitude : 106.6297,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}>
       {markersLocal != undefined && markersLocal.map((marker: any) => (
        <Marker key={marker.title}             
        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
          <Callout style={{width:300,height:310, borderRadius:30}}>
            <View style={{ padding: 10 }}>
                  <View style={{width:300,height:200, borderRadius:30, marginLeft:'15%'}}>
                    <Text style={{padding:12, fontSize:17,fontWeight:'600'}}>Thông tin cửa hàng</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={{padding: 10}}
                            onChangeText={(text) => settitleKey(text)} >
                              {marker.title}
                            </TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                         <TextInput style={{padding:10}}>
                        {marker.NumOfHouse} , {marker.description}
                        </TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                         <TextInput style={{padding:10}}>
                         {marker.ShopCode}
                        </TextInput>
                    </View>
                    <View style={styles.inputContainer}>
                    {marker.ShopCode && <TextInput style={{padding:10}}>{calculateDistance(currentPosition?.latitude, currentPosition?.longitude, marker.latitude, marker.longitude)} km</TextInput>}
                    </View>
                    <TouchableOpacity
                style={{borderColor:'lightgray', borderWidth:0.5,width: '50%', height: '20%',borderRadius:30, justifyContent:'center',alignContent:'center' }}
                onPress={() => handleSave(marker.ShopCode,  titleKey)}
              >
                <Text style={{ alignSelf: 'center' }}>Save</Text>
              </TouchableOpacity>
                </View>
            
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
  input: {
    flex: 1,
    paddingLeft: 10 
},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E5E5E5', 
    width: '80%',
    height: 40,
    marginBottom: 10

},
searchBar: {
  flex:1,
  height: 40,
  backgroundColor: "#f5f5f5",
  flexDirection: 'row',
  alignSelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius:30
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
