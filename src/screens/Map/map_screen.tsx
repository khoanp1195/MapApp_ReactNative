import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, FlatList, Image, Modal, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import RNFS, { readFile } from 'react-native-fs';
import XLSX from 'xlsx';
import DocumentPicker from 'react-native-document-picker';
import MapView, { Marker, Callout, Polyline } from 'react-native-maps';
import Geolocation from "@react-native-community/geolocation";
import { MapData } from "../../services/database/models/MapData";
import { values } from "@nozbe/watermelondb/utils/fp";
import React from "react";
import { Keyboard } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { setLatitude, setLongtitude } from "../../redux/location/reducer";
import * as ImagePicker from 'react-native-image-picker'
import MyPressable from "../../component/MyPressable";
import { AppBarHeader } from "../../component/AppBarHeader";
import { AppBarCustom } from "../../component/AppBarCustom";
import { styles } from "./map.style";
import { BeanMapData } from "../../services/database/models/bean_map";
import { haversine } from "../../util/functions";
import { setIsUpdate, setIsUpdateHome } from "../../redux/detail/reducer";


interface Coordidates {
  Latitude: any;
  Longtiude: any;
}

export const MapScreen = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [loading, setLoading] = useState(false)
  const [coordinate, setCoordinate] = useState<Coordidates[]>([])
  const [markersLocal, setmarkersLocal] = useState<BeanMapData[]>([])
  const [markersLocalNew, setmarkersLocalNew] = useState<BeanMapData[]>([])
  const [filteredData, setFilteredData] = useState<BeanMapData[]>([])
  const [selectedMarker, SetSelectedMarker] = useState<BeanMapData[]>([])
  const [longtitude, SetLongtitude] = useState('');
  const [latitude, SetLatitude] = useState('');
  const [shopName, setShopName] = useState('');
  const [category, setCategory] = useState('')
  const [ratingInfo, setRatingInfo] = useState('');
  const [description, setDescription] = useState('');
  const [isAdd, SetIsAdd] = useState(false)
  const [isAttachFile, setisAttachFile] = useState(false)
  const [searchKey, setSearchKey] = useState("")
  const [titleKey, settitleKey] = useState("")
  const [offset, setOffset] = useState(0);
  const navigation = useNavigation();
  const [latitudetxt, Setlatitude] = useState("")
  const [imageUri, setImageUri] = useState(null)
  const route = useRoute();
  const snapPoints = useMemo(() => ['25%', '50%', '98%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const dispatch = useDispatch();
  const IsStandardMap = useSelector((state: any) => state.appbarCustom.standard)
  const IsSatellite = useSelector((state: any) => state.appbarCustom.satellite)
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  let loadingTimeout;
  const [item, setItem] = React.useState({
    shopName: '',
    note: '',
    imageUri: '',
  });
  const handleMarkerPress = (data: any) => {
    SetSelectedMarker(data)
    setBottomSheetVisible(true);
  };
  const handleCloseBottomSheet = () => {
    setBottomSheetVisible(false);
  };

  // const [latitudeState,SetLatitudeState] = useState("")
  // const [longtitudeState,SetLongtitudeState] = useState("")
  // const { latitude, longitude }: any = route.params;


  // useEffect(() => {
  //   SetLatitudeState(latitude)
  //   SetLongtitudeState(longitude)
  // }, []);
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
  const deleteOldDb = async () => {
    MapData.deleteAll();
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
        WardId: item.WardId,
        Rating: item.Rating,
        Category: item.Category
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


  const getDataMapLocal = async (data: any) => {
    MapData.insertOrUpdateAll(data).then(() => {
      return MapData.getAll(10, offset)
    })
  }

  const clearData = async () => {
    try {
      await MapData.deleteAll();
      setmarkersLocal([])
      Alert.alert('Thông báo', 'Dữ liệu đã được xóa', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    } catch (error) {
      console.error('Error clearing data:', error);
      Alert.alert('Thông báo', 'Đã xảy ra lỗi khi xóa dữ liệu', [
        {
          text: 'OK',
          onPress: () => console.log('OK Pressed'),
        },
      ]);
    }
  };

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position: { coords: { latitude: any; longitude: any; }; }) => {
        const { latitude, longitude } = position.coords;
        // @ts-ignore
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

  const calculateDistance = (currentLat: any, currentLon: any, markerLat: any, markerLon: any) => {
    return haversine(currentLat, currentLon, markerLat, markerLon);
  };
  const handleImageUpload = async () => {
    try {
      const options = {
        title: 'Select Image',
        storageOptions: {
          skipBackup: true,
          path: 'images',
        },
      };
      // @ts-ignore
      const result = await ImagePicker.launchImageLibrary(options);
      const jsonObject = JSON.parse(JSON.stringify(result));
      const uri = jsonObject.assets[0].uri;
      setImageUri(uri);
    } catch (error) {
      console.log("handleImageUpload - error: " + error)
    }
  };

  const saveMarker = async (data: any) => {
    try {
      console.log("Latitude in saveMarker: " + latitude);
      console.log("Longitude in saveMarker: " + longtitude);
      const timestamp = Date.now(); // Lấy thời gian hiện tại
      const shopCode = `SHOP_${timestamp}`;
      const mapDataNew = {
        coordinate: {
          latitude: latitude,
          longitude: longtitude,
        },
        latitude: latitude,
        longitude: longtitude,
        title: data.shopName || 'Unnamed Marker',
        description: data.description,
        NumOfHouse: "",
        ShopCode: shopCode,
        ProvinceId: "",
        DistrictId: "",
        WardId: "",
        Rating: ratingInfo || 5,
        Image: imageUri,
        Category: category
      };
      await MapData.addNewItem(mapDataNew);
      Alert.alert('Add Success', 'Marker added successfully.' + latitude + longtitude, [
        {
          text: 'OK',
          onPress: () => (
            dispatch(setIsUpdate()),
            dispatch(setIsUpdateHome()),
            SetIsAdd(false)),
        },
      ]);
    } catch (error) {
      console.log("saveMarker - Function - map_screen: " + error)
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await MapData.getAll(100, offset);
        setmarkersLocal(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [isAttachFile, isAdd]);

  // useEffect(() => {
  //   const filtered = markersLocal.filter(item => item.title.toLowerCase().includes(searchKey.toLowerCase()));
  //   setFilteredData(filtered);
  // }, [searchKey, markersLocal])

  const handleMapViewPress = () => {
    Keyboard.dismiss();
  };

  const handleSave = async (markerId: any, title: string) => {
    try {
      const retrievedMarker = await MapData.getMapByShopCode(markerId);
      if (!retrievedMarker) {
        return;
      }
      retrievedMarker.map((marker: any) => {
        marker.title = title
      })
      await MapData.insertOrUpdateAll(retrievedMarker).then(() => {
        Alert.alert('Thông báo', 'Dữ liệu đã được cập nhật', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ]);
        setmarkersLocal(retrievedMarker)
      })
    } catch (error) {
      Alert.alert('Thông báo', 'Không thể cập nhật dữ liệu', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ]);
    }
  };

  // const handleRegionChangeComplete = async (newRegion: any) => {
  //   // Fetch data corresponding to the new region coordinates
  //   // You can make an API call or perform any action here
  //   const data = await MapData.getDataBasePosition(newRegion.latitude, newRegion.longitude, 10, markersLocal.length);
  //   setmarkersLocal((prevData) => [...prevData, ...data])
  //   console.log("Data - handleRegionChangeComplete:", data);
  //   console.log("newRegion.latitude - here: " + newRegion.latitude)
  //   console.log("New region:", newRegion);
  // };
  const popularFList = [
    { titleTxt: 'Có chỗ để xe', isSelected: false, icon: 'icon_parking' },
    { titleTxt: 'Phục vụ tại chỗ', isSelected: false, icon: 'icon_cup' },
    { titleTxt: 'Mua mang đi', isSelected: true, icon: 'icon_coffee' },
    { titleTxt: 'Có nhiều ổ cấm', isSelected: false, icon: 'icon_socket' },
    { titleTxt: 'Free wifi', isSelected: false, icon: 'icon_freewifi' },
    { titleTxt: 'Thích hợp để làm việc', isSelected: false, icon: 'icon_freelance' },
    { titleTxt: 'Yên tĩnh', isSelected: false, icon: 'icon_silent' },
    { titleTxt: 'Nhộn nhịp', isSelected: false, icon: 'icon_friend' },
  ];
  const [popularFilterList, setPopularFilterList] = useState(popularFList);
  const getPList = () => {
    const noList: JSX.Element[] = [];
    let count = 0;
    const columnCount = 2;
    const images = (img: string) => {
      switch (img) {
        case 'icon_parking':
          return require('../../assets/images/icon_parking.png')
        case 'icon_friend':
          return require('../../assets/images/icon_friend.png')
        case 'icon_cup':
          return require('../../assets/images/icon_cup.png')

        case 'icon_coffee':
          return require('../../assets/images/icon_coffee.png')
        case 'icon_socket':
          return require('../../assets/images/icon_socket.png')
        case 'icon_freewifi':
          return require('../../assets/images/icon_freewifi.png')

        case 'icon_freelance':
          return require('../../assets/images/icon_freelance.png')
        case 'icon_silent':
          return require('../../assets/images/icon_silent.png')
      }
    };

    for (let i = 0; i < popularFilterList.length / columnCount; i++) {
      const listUI: JSX.Element[] = [];
      for (let j = 0; j < columnCount; j++) {
        const data = popularFilterList[count];
        listUI.push(
          <View
            key={`popular_${j}`}
            style={{ flex: 1, borderRadius: 4, overflow: 'hidden' }}
          >
            <MyPressable
              style={styles.checkBoxBtn}
              touchOpacity={0.6}
              onPress={() => {
                data.isSelected = !data.isSelected;
                setPopularFilterList([...popularFilterList]);
              }}
            >
              <Image
                // @ts-ignore
                source={images(data.icon)}
                resizeMode='center'
                style={{ backgroundColor: data.isSelected ? '#f1b225' : 'transparent', width: 30, height: 30, borderRadius: 20 }}
              />

              <Text style={{
                color: data.isSelected ? '#f1b225' : 'black',
                marginStart: 4,
                fontFamily: 'WorkSans-Regular',
              }}>{data.titleTxt}</Text>
            </MyPressable>
          </View>,
        );

        if (count < popularFilterList.length - 1) {
          count += 1;
        } else {
          break;
        }
      }
      noList.push(
        <View key={noList.length} style={{ flex: 1, flexDirection: 'row' }}>
          {listUI}
        </View>,
      );
    }

    return noList;
  };
  const rating = (data: any) => {
    const images = [];
    for (let i = 0; i < data.Rating; i++) {
      images.push(
        <Image
          key={`star_${i}`}
          source={require("../../assets/images/star.png")}
          style={{ width: 20, height: 20, marginLeft: 5 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{images}</View>;
  };

  const handleLongPress = async (event: any) => {
    const { coordinate } = event.nativeEvent;
    SetLongtitude(coordinate.longitude);
    SetLatitude(coordinate.latitude);
    console.log("Latitude: " + coordinate.latitude);
    console.log("Longitude: " + coordinate.longitude);
    Alert.alert(
      'Add Information',
      'Add the information for this location:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Ok',
          onPress: async () => {
            SetIsAdd(true)
          },
        },
      ],
      { cancelable: true }
    );
  };

  const ModalAdd = (
    <Modal animationType="slide"
      transparent={false}
      visible={isAdd}
      presentationStyle="formSheet"
      onRequestClose={() => {
      }}>
      <ScrollView style={styles.modalAdd}>
        <View style={{ marginTop: '0%', alignItems: 'center', width: '100%', height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => {
            SetIsAdd(false)
          }} style={{ marginLeft: '2%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: 30, height: 30 }}>
            <Image style={{ width: 20, height: 20 }}
              source={require("../../assets/images/icon_close.png")}
            />
          </TouchableOpacity>
          <View style={{ flex: 1, alignItems: 'center', marginRight: '9%' }}>
            <Text style={{ fontWeight: '500', fontSize: 20 }}>Thêm địa chỉ</Text>
          </View>
        </View>
        <View style={styles.line3} />
        <TouchableOpacity onPress={() => {
          handleImageUpload()
        }} style={{
          width: '90%', height: 300, borderRadius: 16,
          alignSelf: 'center',
          shadowColor: 'grey',
          shadowOffset: { width: 4, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          marginTop: '5%',
          backgroundColor: 'blue'
        }} >
          <Image style={{ flex: 1 }}
            source={{ uri: imageUri ? imageUri : '' }}
            defaultSource={require("../../assets/images/tinnoiboloading.png")}
          />
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.inputEdit}
            placeholder="Shop Name"
            value={shopName}
            onChangeText={setShopName}
          />
          <TextInput
            style={styles.inputEdit}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.inputEdit}
            placeholder="Rating"
            value={ratingInfo}
            onChangeText={setRatingInfo}
          />
          <TextInput
            style={styles.inputEdit}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
          <TextInput
            style={styles.inputEdit}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </View>
        {getPList()}
        <View style={{
          flexDirection: 'row',
          height: 150,
          marginTop:'5%',
          backgroundColor: 'white',
          justifyContent: 'space-between'
        }}>

          <View style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            width: '50%',
            height: 50
          }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                width: '80%',
                height: 50,
                borderWidth: 0.5,
                borderColor: 'gray',
                borderRadius: 20,
              }} onPress={() => {
                SetIsAdd(false)
              }} >
              <Text style={{ alignSelf: 'center' }}>Hủy</Text>
            </TouchableOpacity>
          </View>
          <View style={{
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            width: '50%',
            height: 50
          }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                width: '80%',
                height: 50,
                borderWidth: 0.5,
                borderColor: 'gray',
                borderRadius: 20,
              }} onPress={() => {
                saveMarker({ shopName, description, imageUri, ratingInfo })
              }} >
              <Text style={{ alignSelf: 'center' }}>Lưu</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>

    </Modal>


  )
  

  const getPolyline = (latitudeP: any, longtitudeP:any) =>{
    let myLatitude = currentPosition ?  currentPosition.latitude  : 10.8231
    let myLongtitude = currentPosition ? currentPosition.longitude :106.6297
    console.log("myLatitude - here" + myLatitude)
    const coordinates = [
      { latitude: myLatitude, longitude: myLongtitude }, // Starting point
      { latitude: latitudeP, longitude: longtitudeP },   
    ];
    setCoordinate(coordinates)
    setBottomSheetVisible(false)
  }

  return (
    <View style={{ flex: 1 }}>
      <AppBarCustom title={'Map'} IsMap={true} />
      <View style={{ width: '100%', height: '9%', alignContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: 'white' }}>
        <TouchableOpacity onPress={() => {
          // @ts-ignore
          navigation.navigate('search_Screen')
        }} style={{
          height: 55,
          justifyContent: 'center',
          alignItems: 'center',
          width: '70%',
          borderRadius: 10,
          marginLeft: '2%',
          borderColor: 'lightgray'
        }}>
          <TouchableOpacity style={styles.searchBar} onPress={() => {
            // @ts-ignore
            navigation.navigate('search_Screen')
          }}>
            <Image
              style={{
                height: '40%',
                aspectRatio: 1,
                marginLeft: 10,
                justifyContent: 'center',
              }}
              source={require('../../assets/images/icon_search26.png')}
              resizeMode="stretch"
            />
            <Text style={styles.input}>Tìm kiếm ở đây</Text>
          </TouchableOpacity>


        </TouchableOpacity>
        {
          searchKey.length > 1 && filteredData != null && filteredData.length > 0 ?
            <View style={{
              flex: 1,
              width: '90%',
              borderRadius: 10,
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

        <TouchableOpacity onPress={() => {
          // @ts-ignore
          navigation.navigate('Shop_Screen')
        }} style={{ marginLeft: '3%', alignContent: 'center', alignItems: 'center', width: '30%', height: '100%', flexDirection: 'row' }}>
          <Image
            source={require("../../assets/images/icon_list.png")}
            style={styles.icon_list}
          />
          <Text style={{ fontWeight: '500' }}>Danh sách</Text>
        </TouchableOpacity>

      </View>

      <TouchableOpacity style={styles.icon_attach} onPress={() => {
        deleteOldDb()
        fetchData()
      }}>
        <Image
          source={require("../../assets/images/attach_file.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
        handleMoveToCurrentLocation()
      }} style={styles.icon_position}>
        <Image
          source={require("../../assets/images/location.png")}
          style={styles.icon}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon_reload} onPress={() => {
        clearData()
      }}>
        <Image
          source={require("../../assets/images/reload.png")}
          style={styles.icon}
        />
      </TouchableOpacity>
      {/* <View
        style={{
          width: 550,
          height: 200,
          zIndex: 1,
          position: 'absolute',
          top: 100,
          top: '20%',
          backgroundColor: 'white'
        }}>
        <FlatList
          data={markersLocal}
          renderItem={renderItem}
          keyExtractor={item => item.ShopCode}
        />


      </View> */}
 
      <MapView style={{ flex: 1 }}
        onPress={handleMapViewPress}
        region={{
          // @ts-ignore
          latitude: currentPosition ? currentPosition.latitude : 10.8231,//latitudeState != "" ? latitudeState : 
          // @ts-ignore
          longitude: currentPosition ? currentPosition.longitude : 106.6297,//longtitudeState != "" ? longtitudeState : 
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        initialRegion={{
          // @ts-ignore
          latitude: currentPosition ? currentPosition.latitude : 10.8231,//latitudeState != "" ? latitudeState : 
          // @ts-ignore
          longitude: currentPosition ? currentPosition.longitude : 106.6297,//longtitudeState != "" ? longtitudeState :
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // onRegionChangeComplete={handleRegionChangeComplete}
        mapType = { IsStandardMap ? "standard" : "satellite"}
        onLongPress={handleLongPress}
      >
        <Polyline coordinates={coordinate} strokeColor="red" strokeWidth={3} />

        {markersLocal != undefined && markersLocal.map((marker: any, index: any) => (
          <Marker key={`${marker.ShopCode}_${index}`} onPress={(data: any) => {
            handleMarkerPress(marker)
          }}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
          >
            <Image
              source={marker.Image ? { uri: marker.Image } : require("../../assets/images/icon_CoffeeHouse.png")}
              style={styles.markerImage} />
          </Marker>
        ))}

        {currentPosition && (
          <Marker
            coordinate={{
              // @ts-ignore
              latitude: currentPosition.latitude,
              // @ts-ignore
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
      {
        selectedMarker && (
          <BottomSheet
            index={bottomSheetVisible ? 1 : -1}
            snapPoints={snapPoints}
            onChange={handleCloseBottomSheet}
          >
            <ScrollView key={`${selectedMarker.ShopCode}`} style={{ height: 2000, backgroundColor: 'white' }}>
              <ScrollView horizontal={true} style={{ flexDirection: 'row', backgroundColor: 'white', height: 350 }}>
                <View style={{ marginRight: 7 }}>
                  <Image source={{ uri: selectedMarker.Image }}
                    defaultSource={require("../../assets/images/tinnoiboloading.png")}
                    style={{ width: 330, height: '100%' }} />
                </View>
                <View style={{ marginRight: 7 }}>
                  <Image source={{ uri: selectedMarker.Image }}
                    defaultSource={require("../../assets/images/tinnoiboloading.png")}
                    style={{ width: 330, height: '100%' }} />
                </View>
                <View>
                  <Image source={{ uri: selectedMarker.Image }}
                    defaultSource={require("../../assets/images/tinnoiboloading.png")}
                    style={{ width: 330, height: '100%' }} />
                </View>
              </ScrollView>


              <Text style={{ marginLeft: '3%', marginTop: '5%' }}>THE COFFEE HOUSE</Text>
              <View style={{ width: '100%', height: 1000, borderRadius: 30 }}>
                <Text style={{ padding: 3, fontSize: 20, fontWeight: '600', width: '100%', marginLeft: '3%' }}>{selectedMarker.title}</Text>
                <Text style={{ padding: 3, fontSize: 15, width: '100%', color: 'gray', marginLeft: '3%' }}>Giờ mở cửa: 7:00 - 21:30</Text>


                <View style={styles.line2} />

                <View style={styles.inputContainer}>
                  <View style={{ backgroundColor: 'lightgray', width: 50, height: 50, marginLeft: '3%', borderRadius: 10, justifyContent: 'center' }}>
                    <Image source={require("../../assets/images/icon_address.png")} style={styles.positionImage} />
                  </View>
                  <Text style={{ width: '85%', marginLeft: '3%' }}>{selectedMarker.NumOfHouse} , {selectedMarker.description}</Text>
                </View>

                <View style={styles.lineChild} />


                <View style={styles.inputContainer}>
                  <View style={{ backgroundColor: 'lightgray', width: 50, height: 50, marginLeft: '3%', borderRadius: 10, justifyContent: 'center' }}>
                    <Image source={require("../../assets/images/icon_favorite_home.png")} style={styles.positionImage} />
                  </View>
                  <Text style={{ width: '2%', marginLeft: '3%' }}>{selectedMarker.Rating}</Text>
                  {rating(selectedMarker)}
                </View>


                <View style={styles.lineChild} />


                <TouchableOpacity style={styles.inputContainer}>
                  <View style={{ backgroundColor: 'lightgray', width: 50, height: 50, marginLeft: '3%', borderRadius: 10, justifyContent: 'center' }}>
                    <Image source={require("../../assets/images/icon_favorite.png")} style={styles.positionImage} />
                  </View>
                  <Text style={{ width: '100%', fontSize: 15, marginLeft: '3%' }}>Thêm vào danh sách yêu thích</Text>
                </TouchableOpacity>


                <View style={styles.lineChild} />


                <View style={styles.inputContainer}>
                  <View style={{ backgroundColor: 'lightgray', width: 50, height: 50, marginLeft: '3%', borderRadius: 10, justifyContent: 'center' }}>
                    <Image source={require("../../assets/images/icon_distance.png")} style={styles.positionImage} />
                  </View>
                  {selectedMarker.ShopCode && <TextInput style={{ padding: 10 }}>Khoảng cách: {calculateDistance(currentPosition?.latitude, currentPosition?.longitude, selectedMarker.latitude, selectedMarker.longitude)} km</TextInput>}
                </View>


                <View style={styles.lineChild} />

                <TouchableOpacity style={styles.inputContainer}>
                  <View style={{ backgroundColor: 'lightgray', width: 50, height: 50, marginLeft: '3%', borderRadius: 10, justifyContent: 'center' }}>
                    <Image source={require("../../assets/images/icon_favorite.png")} style={styles.positionImage} />
                  </View>
                  <Text style={{ width: '100%', fontSize: 15, marginLeft: '3%' }}>Chia sẻ với bạn bè</Text>
                </TouchableOpacity>
                <View style={styles.lineChild} />
                <Text style={{ marginLeft: '3%', marginTop: '5%', fontWeight: '600', fontSize: 18 }}>Tiện ích</Text>

                <View style={styles.tienIchField}>
                  {getPList()}
                </View>
                <View style={styles.lineChild} />
                <TouchableOpacity onPress={()=>{
                    getPolyline(selectedMarker.latitude, selectedMarker.longitude)
                }} style={{
                  backgroundColor:'#f1b225',
                  alignSelf:'center', 
                  marginTop:'5%',
                  borderRadius:15 ,
                  width:'80%', 
                  height:'5%',
                  justifyContent:'center',
                  alignContent:'center',
                  alignItems:'center'}}>
                  <Text style={{fontSize:17}}>How to get there</Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </BottomSheet>
        )
      }

      {/* Bottom Sheet */}
      {isAdd && ModalAdd}

    </View>
  );
};


