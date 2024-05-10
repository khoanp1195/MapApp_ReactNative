import { Alert, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { FontSize, dimensWidth } from '../../themes/const'
import colors from '../../themes/Colors'
import { AppBarCustom } from '../../component/AppBarCustom'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import Input from '../../component/Input'
import * as ImagePicker from 'react-native-image-picker'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { text } from '@nozbe/watermelondb/decorators'
import { MapData } from '../../services/database/models/MapData'
import { useDispatch, useSelector } from 'react-redux'
import { setIsUpdate, setIsUpdateHome } from '../../redux/detail/reducer'
import { setIsFindItem, setLatitude, setLongtitude } from '../../redux/location/reducer'
import { BeanMapData } from '../../services/database/models/bean_map'
import MyPressable from '../../component/MyPressable'
import MapView, { Animated, Marker } from 'react-native-maps'
import { styles } from './detail.style'
import { windowHeight } from '../../config/font'
import { ImageChildData } from '../../services/database/models/ImageChildData'
import { BeanImageChildData } from '../../services/database/models/bean_imageChild'
import * as Animatable from 'react-native-animatable';



export const Detail_shop_Screen = () => {
    const route = useRoute()
    // @ts-ignore
    const item = route.params['item'];
    const navigation = useNavigation();
    const [isEdit, SetIsEdit] = useState(false)
    const [textArea, setTextArea] = useState('');
    const [imageUri, setImageUri] = useState(null)
    const [imageUriChild, setImageUriChild] = useState(null)
    const [shopName, SetShopName] = useState("")
    const [shopCode, SetShopCode] = useState(item.ShopCode)
    const [address, SetAddress] = useState("")
    const [rating, SetRating] = useState("")
    const [status, SetStatus] = useState("")
    const [note, SetNote] = useState("")
    const [data, setData] = useState<BeanMapData[]>([])
    const [IsImgeChildView, SetIsImgeChildView] = useState(false)
    const isUpdateFinish = useSelector((state: any) => state.detail.IsUpdate);
    const [dataImageChild, SetDataImageChild] = useState<BeanImageChildData[]>([])
    const [imageUriSelected, SetImageUriSelected] = useState('')
    const [IsimageSelected, SetIsimageSelected] = useState(false)
    const [IsSelected, SetIsSelected] = useState(false)
    const [indexImage, SetIndexImage] = useState('')
    const dispatch = useDispatch();
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
    const [popularFilterList, setPopularFilterList] = useState(item.Utilities ? JSON.parse(item.Utilities) : []);
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
                        style={{
                            flexDirection: 'column',
                            borderRadius: 4,
                            overflow: 'hidden',
                            backgroundColor: 'blue',
                            height: 300,
                            width: '60%'
                        }}
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
                                resizeMode='contain'
                                style={{
                                    backgroundColor: data.isSelected ? '#f1b225' : 'transparent',
                                    width: 50,
                                    height: 50,
                                    borderRadius: 10,
                                }}
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
                <View key={noList.length} style={{
                    flex: 1,
                    flexDirection: 'row',
                    marginTop: 20,
                }}>
                    {listUI}
                </View>,
            );
        }

        return noList;
    };
    const images = []
    for (let i = 0; i <= item.Rating; i++) {
        images.push(
            <Image
                source={require("../../assets/images/star.png")}
                style={{ width: 20, height: 20, marginLeft: 5 }}
            />
        )
    }
    useEffect(() => {
        setData(item)
        const fetchData = async () => {
            const dataImageChild = await ImageChildData.getAll(100, 0)
            const filtered = dataImageChild.filter(item => item.ShopCode.includes(shopCode));
            SetDataImageChild(filtered)
        }
        fetchData()
    }, [isEdit])

    const handleEdit = () => {
        Alert.alert(
            'Xác nhận chỉnh sửa',
            'Bạn có muốn chỉnh sửa?',
            [
                {
                    text: 'Hủy',
                    style: 'cancel'
                },
                {
                    text: 'Chỉnh sửa',
                    onPress: () => {
                        // Add your edit logic here
                        SetIsEdit(true)
                        console.log('User chose to edit');
                    }
                }
            ]
        );
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

    const handleImageUploadForChildImage = async () => {
        try {
            const options = {
                title: 'Select Image',
                storageOptions: {
                    skipBackup: true,
                    path: 'images',
                },
            };
            const result = await ImagePicker.launchImageLibrary(options);
            const jsonObject = JSON.parse(JSON.stringify(result));
            const uri = jsonObject.assets[0].uri;
            setImageUriChild(uri)
            saveChildImage(uri)
        } catch (error) {
            console.log("handleImageUpload - error: " + error);
        }
    };

    const saveChildImage = async (imageUri: any) => {
        const mapDataNew = {
            title: "",
            ShopCode: shopCode,
            Image: imageUri,
        }
        await ImageChildData.addNewItem(mapDataNew)
        Alert.alert('Add Success', 'Marker added successfully', [
            {
                text: 'OK',
                onPress: () => (
                    dispatch(setIsUpdate()),
                    dispatch(setIsUpdateHome())),
            },
        ]);
    }


    const handleSave = async (item: any) => {
        try {
            const currentItem = await MapData.getMapByShopCode(shopCode)
            if (!currentItem) return;

            currentItem.map((data: any) => {
                data.title = item.shopName != "" ? item.shopName : data.shopName,
                    data.Note = item.note,
                    data.Image = item.imageUri
                data.Utilities = JSON.stringify(popularFilterList)
            })
            await MapData.insertOrUpdateAll(currentItem).then(() => {

                Alert.alert('Thông báo', 'Dữ liệu đã được thay đổi', [
                    {
                        text: 'Cancel',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            dispatch(setIsUpdate())
                            dispatch(setIsUpdateHome())
                            console.log('OK Pressed')
                        }
                    },
                ]);
                setData(currentItem)
                SetIsEdit(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        try {
            await MapData.deleteItemByShopCode(shopCode)
            Alert.alert('Thông báo', 'Dữ liệu đã được thêm', [
                {
                    text: 'OK',
                    onPress: () => {
                        dispatch(setIsUpdate());
                        dispatch(setIsUpdateHome())
                        navigation.goBack();
                    },
                },
            ]);
        } catch (error) {
            console.log("handleDelete - error: " + error)
        }
    }

    const MySeparator = () => {
        return <View style={{ width: 10 }} />; // Adjust width for desired spacing
    };

    const [showFullList, setShowFullList] = useState(false);
    const newDataTest = [...dataImageChild, { id: dataImageChild.length + 1, title: 'More' }];
    var displayData = showFullList ? newDataTest : newDataTest.slice(0, 5)
    // Check if an item with the title "More" exists in the array
    const hasMoreItem = dataImageChild.some(item => item.title === 'More');

    // If "More" item doesn't exist, append it to the displayedData array
    if (!hasMoreItem) {
        displayData = [...displayData, { id: 4, title: 'More' }];
    }
    const ListImage = ({ item, index }: any) => (
        <TouchableOpacity onPress={() => {
            if (item.title === "More") {
                SetIsImgeChildView(true)
            }
            else {
                SetIndexImage(index)
                SetImageUriSelected(item.Image)
                SetIsimageSelected(true)
                SetIsSelected(true)
            }
        }} style={{
            borderRadius: 18,
            elevation: 8,
            shadowColor: 'grey',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 2,
            shadowRadius: 12,
            borderBottomWidth: 1,
            borderColor: '#ccc',
            backgroundColor: 'rgba(128, 128, 128, 0.5)',
            width: 80,
            height: 80,
            justifyContent: 'center',
            alignSelf: 'center',
        }}>
            {
                item.title === "More" ?
                    <View
                        style={{
                            width: '90%', height: '90%',
                            borderRadius: 16,
                            shadowColor: 'grey',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 2,
                            shadowRadius: 12,
                            alignSelf: 'center',
                            // backgroundColor: 'rgba(128, 128, 128, 0.2)',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center'
                        }} >
                        <Text style={{
                            position: 'absolute',
                            zIndex: 99
                        }}>+ {dataImageChild.length}</Text>
                        <Image source={item.Image ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
                            style={{
                                width: '90%', height: '90%',
                                borderRadius: 16,
                                shadowColor: 'grey',
                                shadowOffset: { width: 4, height: 4 },
                                shadowOpacity: 2,
                                shadowRadius: 12,
                                alignSelf: 'center'
                            }} />
                    </View>
                    :
                    <Image source={item.Image ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
                        style={{
                            width: '90%', height: '90%',
                            borderRadius: 16,
                            shadowColor: 'grey',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 2,
                            shadowRadius: 12,
                            alignSelf: 'center'
                        }} />
            }

        </TouchableOpacity>
    );

    const imagesTienIch = (img: string) => {
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

    const listImageTienIch = ({ item }: any) => (

        <TouchableOpacity onPress={() => {
            if (item.title === "More") {
                SetIsImgeChildView(true)
            }
            else {
                handleImageUploadForChildImage()
            }
        }} style={{
            width: '20%',
            height: 90,
            marginTop: 30,
            marginLeft: '4.5%',
            justifyContent: 'center',
            alignSelf: 'center',
            flexDirection: 'column',

        }}>
            <View style={{
                width: '90%',
                height: 60,
                justifyContent: 'center',
                alignContent: 'center',
                borderRadius: 15,
                shadowColor: 'grey',
                shadowOffset: { width: 4, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                backgroundColor: item.isSelected ? '#f1b225' : '#f4f5ee',
            }}>
                <Image
                    source={imagesTienIch(item.icon)}
                    style={{
                        width: '50%', height: '50%',
                        alignSelf: 'center',
                    }} />

            </View>
            <Text numberOfLines={1} style={{ marginTop: 10, fontSize: 11, alignSelf: 'center', fontWeight: '600' }}>{item.titleTxt}</Text>
        </TouchableOpacity>
    );


    const listImageChild = ({ item }: any) => (
        <TouchableOpacity onPress={() => {
            if (item.title === "More") {
                SetIsImgeChildView(true)
            }
            else {
                handleImageUploadForChildImage()
            }
        }} style={{
            elevation: 8,
            shadowColor: 'grey',
            shadowOffset: { width: 4, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            borderBottomWidth: 1,
            borderColor: '#ccc',
            width: '33,7%',
            height: 150,
            justifyContent: 'center',
            alignSelf: 'center',
        }}>
            <Image source={item.Image ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
                style={{
                    width: '99%', height: '99%',
                    borderRadius: 5,
                    shadowColor: 'grey',
                    shadowOffset: { width: 4, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    alignSelf: 'center'
                }} />
        </TouchableOpacity>
    );

    {/* Test HOC */ }
   // Higher Order Component (HOC) for adding a border to a component
const withBorder = (WrappedComponent) => {
    return (props) => {
      return (
        <View style={{ borderWidth: 1, padding: 10 }}>
          <WrappedComponent {...props} />
        </View>
      );
    };
  };
  
  // Functional Component to be wrapped by the HOC
  const MyComponent = (props) => {
    return (
      <View>
        <Text>{props.text}</Text>
      </View>
    );
  };
  
  // Wrap MyComponent with the withBorder HOC
  const MyComponentWithBorder = withBorder(MyComponent);
  


    const ModalImageChild = (
        <Modal animationType="slide"
            transparent={false}
            visible={IsImgeChildView}
            presentationStyle="formSheet"
            onRequestClose={() => {
            }}>
            <ScrollView style={styles.modalAdd}>
                <View style={{ marginTop: '0%', alignItems: 'center', width: '100%', height: 60, backgroundColor: 'white', flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => {
                        SetIsImgeChildView(false)
                    }} style={{ marginLeft: '2%', justifyContent: 'center', alignContent: 'center', alignItems: 'center', width: 30, height: 30 }}>
                        <Image style={{ width: 20, height: 20 }}
                            source={require("../../assets/images/icon_close.png")}
                        />
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center', marginRight: '9%' }}>
                        <Text style={{ fontWeight: '500', fontSize: 20 }}>List of Image</Text>
                    </View>
                </View>
                <FlatList
                    numColumns={3}
                    contentContainerStyle={{ marginLeft: '1%' }}
                    ItemSeparatorComponent={MySeparator}
                    data={newDataTest} // Array of data objects
                    renderItem={listImageChild} // Function to render each item             
                    // @ts-ignore
                    keyExtractor={item => item.id} // Function to extract a unique key for each item
                />
                <TouchableOpacity
                    onPress={() => {
                        handleImageUploadForChildImage({ imageUriChild })
                    }}
                    style={{
                        backgroundColor: '#e0d6d0',
                        width: 60,
                        height: 60,
                        position: 'absolute',
                        zIndex: 99,
                        top: 740,
                        left: 350,
                        borderRadius: 30,
                        shadowColor: 'grey',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Image
                        source={require("../../assets/images/attach_file.png")}
                        style={{ width: 40, height: 40 }}
                    />

                </TouchableOpacity>
            </ScrollView>
        </Modal>
    )




    return (
        <Animatable.View
            animation={'fadeInLeft'}
            duration={1000}
            delay={1 * 300}
        >
            <ScrollView style={styles.item}>

                <View style={{ height: isEdit ? 2200 : 1540, width: '100%', backgroundColor: 'white' }}>
                    {/* <AppBarCustom title={'Chi tiết cửa hàng'} /> */}
                    <TouchableOpacity style={styles.touch} onPress={() => {
                        navigation.goBack();
                    }}>
                        <Image
                            style={styles.image}
                            source={require('../../assets/images/icon_back.png')}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <Image source={{ uri: imageUri ? imageUri : item.Image }}
                        defaultSource={require("../../assets/images/tinnoiboloading.png")}
                        style={{
                            width: '100%', height: 470, borderRadius: 16,
                            shadowColor: 'grey',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                        }} />
                    <View
                        style={{
                            borderRadius: 15,
                            zIndex: 999,
                            position: 'absolute',
                            top: 370,
                            shadowColor: '#000',
                            shadowOpacity: 0.2,
                            shadowRadius: 10,
                            elevation: 5,
                            width: '95%',
                            alignSelf: 'center',
                            height: '5%',
                            alignContent: 'center',
                            flexDirection: 'row'
                        }}>
                        <FlatList
                            horizontal={true}
                            ItemSeparatorComponent={MySeparator}
                            data={displayData} // Array of data objects
                            renderItem={({ item, index }) => (
                                <ListImage item={item} index={index} />
                            )}
                            // @ts-ignore
                            keyExtractor={item => item.id} // Function to extract a unique key for each item
                        />

                    </View>

                    <View style={{ flexDirection: 'row', width: '100%', height: isEdit ? 90 : 70, marginTop: '3%' }}>
                        <View style={styles.flexDirectionBetween}>
                            <View style={{ width: '100%', height: isEdit ? 90 : 50, flexDirection: 'row' }}
                            >
                                {/* <Text style={{ fontSize: 16, fontWeight: '600' }}>Name Of Shop</Text> */}
                                {
                                    isEdit ? (
                                        <TextInput
                                            onChangeText={(text) => SetShopName(text)}
                                            style={styles.titleEdit}
                                            numberOfLines={2}>
                                            {item.title}
                                        </TextInput>) :
                                        (<Text style={styles.title} numberOfLines={2}>
                                            {item.title}
                                        </Text>)
                                }
                                <View style={styles.touchSendUnit}>
                                    {
                                        isEdit ? (<TextInput style={styles.textSendUnit}>Đang mở cửa</TextInput>)
                                            : (<Text style={{
                                                fontSize: dimensWidth(12),
                                                color: colors.primary,
                                                fontWeight: '400',
                                                fontFamily: 'arial',
                                                height: isEdit ? 50 : 20,
                                            }}>Đang mở cửa</Text>)
                                    }
                                </View>
                            </View>
                            <View style={{
                                width: '100%',
                                height: 40, flexDirection: 'row'
                            }}>
                                <Image
                                    source={require("../../assets/images/location.png")}
                                    resizeMode="contain"
                                    style={{ width: 20, height: 20 }}
                                />
                                <Text style={{ marginLeft: '2%' }}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</Text>

                            </View>
                            <View style={{
                                width: '100%', height: 30, flexDirection: 'row'
                            }}>

                                <Text>{item.Rating}</Text>
                                {images}
                            </View>



                            <View style={{ height: 250, width: '100%' }}>
                                <FlatList
                                    numColumns={4}
                                    style={{ flex: 1 }}
                                    contentContainerStyle={{}}
                                    ItemSeparatorComponent={MySeparator}
                                    data={popularFilterList} // Array of data objects
                                    renderItem={listImageTienIch} // Function to render each item
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    // @ts-ignore
                                    keyExtractor={item => item.id} // Function to extract a unique key for each item
                                />
                            </View>
                            <View style={{ marginTop: 20, height: 170, width: '100%', flexDirection: 'column' }}>
                                <Text style={{ fontSize: 20, fontWeight: '600' }}>Description</Text>
                                <Text
                                    style={styles.textNote}
                                    numberOfLines={10}
                                >{item.Note}</Text>
                            </View>

                            <View style={{
                                flexDirection: 'column',
                                marginTop: isEdit ? '5%' : '11%',
                                height: 55,
                            }}>
                                <Text style={{ fontSize: 17, fontWeight: '600' }}>Price</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: '3%',
                                    height: '100%'
                                }}>
                                    {
                                        isEdit ? (<TextInput style={styles.titleEdit}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</TextInput>) :
                                            (<Text style={[{ flex: 1 }, styles.category]}>29.000 - 40.000</Text>)
                                    }
                                </View>
                            </View>
                            <View style={{
                                flexDirection: 'column',
                                marginTop: isEdit ? '12%' : '2%',
                                height: 55,
                            }}>
                                <Text style={{ fontSize: 17, fontWeight: '600' }}>Open</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    marginTop: '3%',
                                    height: '100%'
                                }}>
                                    {
                                        isEdit ? (<TextInput style={styles.titleEdit}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</TextInput>) :
                                            (<Text style={[{ flex: 1 }, styles.category]}>07:00 - 21:30</Text>)
                                    }
                                </View>
                            </View>


                            {/* <View style={{ width: '100%', marginTop: isEdit ? '7%' : 200, height: isEdit ? 90 : 70, flexDirection: 'column' }}
            >
                <Text style={{ fontSize: 16, fontWeight: '600' }}>Shop Code</Text>
                {
                    isEdit ? (
                        <TextInput
                            onChangeText={(text) => SetShopCode(item.ShopCode)}
                            style={styles.titleEdit}>{item.ShopCode}</TextInput>) :
                        (null)
                }
            </View> */}

                        </View>


                        <TouchableOpacity style={{
                            width: 50, height: isEdit ? 50 : 0,
                            backgroundColor: '#f6f6f6', borderRadius: 30, justifyContent: 'center'
                        }}>
                            <Image
                                source={require("../../assets/images/icon_favorite.png")}
                                resizeMode="contain"
                                style={{ width: '100%', height: '50%' }}
                            />
                        </TouchableOpacity>
                    </View>


                    {
                        !isEdit ? (
                            <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'column', marginTop: '160%', height: '15%' }}>
                                <Text style={{ fontSize: 17, fontWeight: '600' }}>Map</Text>
                                <MapView style={{
                                    flex: 1, marginTop: '5%',
                                    borderRadius: 30,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 4, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                }}
                                    region={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    initialRegion={{
                                        latitude: item.latitude,
                                        longitude: item.longitude,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    // onRegionChangeComplete={handleRegionChangeComplete}
                                    mapType="terrain"
                                >
                                    <Marker
                                        coordinate={{
                                            // @ts-ignore
                                            latitude: item.latitude,
                                            // @ts-ignore
                                            longitude: item.longitude,
                                        }}
                                        title="Current Position"
                                    />
                                </MapView>
                            </View>

                        ) : null
                    }
                    {
                        isEdit ? (<View style={{ width: '100%', flexDirection: 'column', height: 200, marginTop: '10%' }}>
                            <Text style={{ fontSize: 17, fontWeight: '600' }}>Attchments</Text>
                            <View style={{
                                borderWidth: 0.5, borderStyle: "dashed", width: '100%', height: '100%',
                                marginTop: '3%', flexDirection: 'row', alignItems: 'center'
                            }}>
                                <TouchableOpacity style={{ width: '40%', marginLeft: '8%', height: '75%', borderWidth: 0.5, backgroundColor: '#f6f6f6', flexDirection: 'column' }}>
                                    <Image
                                        source={require("../../assets/images/icon_camera.png")}
                                        resizeMode="contain"
                                        style={{ width: 40, height: 40, alignSelf: 'center', marginTop: '20%' }}
                                    />
                                    <Text style={{ alignSelf: 'center', marginTop: '5%' }}>Take a new photo</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {
                                    handleImageUpload()
                                }} style={{ width: '40%', marginLeft: '5%', height: '75%', borderWidth: 0.5, backgroundColor: '#f6f6f6', flexDirection: 'column' }}>
                                    <Image
                                        source={require("../../assets/images/icon_attachfile_detail.png")}
                                        resizeMode="contain"
                                        style={{ width: 40, height: 40, alignSelf: 'center', marginTop: '20%' }}
                                    />
                                    <Text style={{ alignSelf: 'center', marginTop: '5%' }}>Upload an attach</Text>
                                </TouchableOpacity>
                            </View>
                        </View>) : null
                    }
                    {
                        isEdit ?
                            (
                                <View style={{ width: '100%', flexDirection: 'column', marginTop: '8%', height: isEdit ? '10%' : 0 }}>
                                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Notes</Text>
                                    {
                                        isEdit ? (<TextInput
                                            style={styles.textArea}
                                            multiline={true}
                                            numberOfLines={4}
                                            onChangeText={(text) => SetNote(text)}
                                            value={note}
                                            placeholder="Enter text here"
                                        />) : (
                                            <Text
                                                style={styles.textArea}
                                                numberOfLines={10}
                                            >{item.Note}</Text>)
                                    }
                                </View>) : null
                    }
                </View>


                {/* Test HOC */}
                {/* <View style={{ width: '100%', height: 100 }}>
                    <MyComponentWithBorder text="Hello Khoa" />
                </View> */}


                <View style={{ width: '100%', zIndex: 99, position: 'absolute', top: isEdit ? '94%' : '95%', height: 70, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        // dispatch(setLatitude(item.latitude))
                        // dispatch(setLongtitude(item.longitude))
                        dispatch(setIsFindItem(true))
                        handleSave({ shopName, note, imageUri, shopCode })
                    }
                    }
                        style={{ justifyContent: 'center', alignItems: 'center', width: '55%', height: '80%', backgroundColor: '#ebc63c', marginRight: 5, borderRadius: 10 }}>
                        <Text style={{ fontWeight: '400', fontSize: 17 }}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        handleEdit()
                    }} style={{ width: '20%', height: '80%', borderWidth: 0.5, marginRight: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../assets/images/icon_edit.png')}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {

                        //Tạm đóng sẽ sử dụng lại
                        // if (item && item.latitude && item.longitude) {
                        //     dispatch(setLatitude(item.latitude))
                        //     dispatch(setLongtitude(item.longitude))
                        //     dispatch(setIsFindItem(true))
                        //     // @ts-ignore
                        //     navigation.navigate('MapScreen', {
                        //         latitude: item.latitude,
                        //         longitude: item.longitude
                        //     });
                        // } else {
                        //     console.error('Invalid item or location');
                        // }

                        handleDelete()
                    }}
                        style={{ width: '20%', height: '80%', borderWidth: 0.5, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require('../../assets/images/icon_delete.png')}
                            resizeMode="stretch"
                        />
                    </TouchableOpacity>
                </View>
                {IsImgeChildView && ModalImageChild}
                {IsimageSelected &&
                    <Animatable.View
                        animation={IsimageSelected ? 'bounceIn' : 'zoomOut'}
                        duration={2000}
                        delay={indexImage * 100}
                        style={{
                            width: '100%', top: 2, height: '55%', position: 'absolute', zIndex: 99,
                            shadowColor: 'grey',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                SetIsimageSelected(false)
                            }}
                                style={{
                                    width: 50,
                                    height: 50
                                    , position: 'absolute',
                                    zIndex: 999, left: '85%',
                                    top: '2%',
                                    borderRadius: 30,
                                    backgroundColor: "lightgray",
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Image style={{ width: 20, height: 20 }}
                                    source={require("../../assets/images/icon_close.png")}
                                />
                            </TouchableOpacity>
                            <Image source={{ uri: imageUriSelected ? imageUriSelected : "" }}
                                defaultSource={require("../../assets/images/tinnoiboloading.png")}
                                style={{
                                    flex: 1,
                                    borderRadius: 16,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 4, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                }} />

                        </View>
                    </Animatable.View>}
                {!IsimageSelected && IsSelected &&
                    <Animatable.View
                        animation={'zoomOut'}
                        duration={2000}
                        delay={indexImage * 100}
                        style={{
                            width: '100%', top: 2, height: '55%', position: 'absolute', zIndex: 99,
                            shadowColor: 'grey',
                            shadowOffset: { width: 4, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 12,
                        }}
                    >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity onPress={() => {
                                SetIsimageSelected(false)
                            }}
                                style={{
                                    width: 50,
                                    height: 50
                                    , position: 'absolute',
                                    zIndex: 999, left: '85%',
                                    top: '2%',
                                    borderRadius: 30,
                                    backgroundColor: "lightgray",
                                    justifyContent: 'center',
                                    alignContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Image style={{ width: 20, height: 20 }}
                                    source={require("../../assets/images/icon_close.png")}
                                />
                            </TouchableOpacity>
                            <Image source={{ uri: imageUriSelected ? imageUriSelected : "" }}
                                defaultSource={require("../../assets/images/tinnoiboloading.png")}
                                style={{
                                    flex: 1,
                                    borderRadius: 16,
                                    shadowColor: 'grey',
                                    shadowOffset: { width: 4, height: 4 },
                                    shadowOpacity: 0.3,
                                    shadowRadius: 12,
                                }} />
                        </View>
                    </Animatable.View>}


            </ScrollView>
        </Animatable.View>

    )
}


/*

                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '40%' : 0,
                    height: isEdit ? 85 : 0,
                    
                }} >

                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Address</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: '3%',
                        height: '100%'
                    }}>
                        {
                            isEdit ? (<TextInput style={styles.titleEdit}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</TextInput>) : 
                            null
                        }
                    </View>

                </View>

                <View style={{ width: '100%', height: isEdit ? 70 : 0, marginTop: isEdit ? '15%' : 0 }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Rating</Text>
                    <View style={{ width: '100%', marginTop: '3%', height: 30, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <Text>{item.Rating}</Text>
                        {images}
                    </View>
                </View>

                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '5%' : '5%',
                    height: isEdit ?  55 : 0,
                }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Status</Text>
                    <View style={styles.touchSendUnit}>
                        {
                            isEdit ? (<TextInput style={styles.textSendUnit}>Đang mở cửa</TextInput>)
                                : (<Text style={{

                                    fontSize: dimensWidth(12),
                                    color: colors.primary,
                                    fontWeight: '400',
                                    fontFamily: 'arial',
                                    height: isEdit ? 50 : 20,
                                }}>Đang mở cửa</Text>)
                        }
                    </View>

                </View>



                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '15%' : '5%',
                    height: isEdit ? 205 : 0,
                }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Tiện ích</Text>
                    {/* {getPList()} 
                    // </View>


                    // <View style={{ width: '100%', flexDirection: 'column', marginTop: '8%', height: isEdit ? '10%' : 0 }}>
                    //     <Text style={{ fontSize: 17, fontWeight: '600' }}>Notes</Text>
                    //     {
                    //         isEdit ? (<TextInput
                    //             style={styles.textArea}
                    //             multiline={true}
                    //             numberOfLines={4}
                    //             onChangeText={(text) => SetNote(text)}
                    //             value={note}
                    //             placeholder="Enter text here"
                    //         />) : (
                    //             <Text
                    //                 style={styles.textArea}
                    //                 numberOfLines={10}
                    //             >{item.Note}</Text>)
                    //     }
                    // </View>*/
