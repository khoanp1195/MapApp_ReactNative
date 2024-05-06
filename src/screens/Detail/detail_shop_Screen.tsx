import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import MapView, { Marker } from 'react-native-maps'
import { styles } from './detail.style'

export const Detail_shop_Screen = () => {
    const route = useRoute()
    // @ts-ignore
    const item = route.params['item'];
    const navigation = useNavigation();
    const [isEdit, SetIsEdit] = useState(false)
    const [textArea, setTextArea] = useState('');
    const [imageUri, setImageUri] = useState(null)
    const [shopName, SetShopName] = useState("")
    const [shopCode, SetShopCode] = useState(item.ShopCode)
    const [address, SetAddress] = useState("")
    const [rating, SetRating] = useState("")
    const [status, SetStatus] = useState("")
    const [note, SetNote] = useState("")
    const [data, setData] = useState<BeanMapData[]>([])
    const isUpdateFinish = useSelector((state: any) => state.detail.IsUpdate);
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


    const handleSave = async (item: any) => {
        try {
            const currentItem = await MapData.getMapByShopCode(shopCode)
            if (!currentItem) return;

            currentItem.map((data: any) => {
                data.title = item.shopName != "" ? item.shopName : data.shopName,
                    data.Note = item.note,
                    data.Image = item.imageUri
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
            Alert.alert('Thông báo', 'Dữ liệu đã được xóa', [
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

    return (
        <ScrollView style={styles.item}>

            <View style={{ height: isEdit ? 2100 : 2000, width: '100%', backgroundColor: 'white' }}>
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
                        width: '100%', height: 400, borderRadius: 16,
                        shadowColor: 'grey',
                        shadowOffset: { width: 4, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 12,
                    }} />
                <View style={{ flexDirection: 'row', width: '100%', height: isEdit ? 90 : 70, marginTop: '3%' }}>
                    <View style={styles.flexDirectionBetween}>
                        <View style={{ width: '100%', height: isEdit ? 90 : 60, marginTop: '5%', flexDirection: 'column' }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Name Of Shop</Text>
                            {
                                isEdit ? (
                                    <TextInput
                                        onChangeText={(text) => SetShopName(text)}
                                        style={styles.titleEdit}
                                        numberOfLines={2}>
                                        {item.title}
                                    </TextInput>) : (<Text style={styles.title} numberOfLines={2}>
                                        {item.title}
                                    </Text>)
                            }
                        </View>


                        <View style={{ width: '100%', marginTop: isEdit ? '7%' : null, height: isEdit ? 90 : 70, flexDirection: 'column' }}
                        >
                            <Text style={{ fontSize: 16, fontWeight: '600' }}>Shop Code</Text>
                            {
                                isEdit ? (
                                    <TextInput
                                        onChangeText={(text) => SetShopCode(item.ShopCode)}
                                        style={styles.titleEdit}>{item.ShopCode}</TextInput>) :
                                    (<Text style={styles.date}>{item.ShopCode}</Text>)
                            }
                        </View>

                    </View>


                    <TouchableOpacity style={{
                        width: 50, height: 50,
                        backgroundColor: '#f6f6f6', borderRadius: 30, justifyContent: 'center'
                    }}>
                        <Image
                            source={require("../../assets/images/icon_favorite.png")}
                            resizeMode="contain"
                            style={{ width: '100%', height: '50%' }}
                        />
                    </TouchableOpacity>
                </View>


                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '40%' : '17%',
                    height: 85
                }} >

                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Address</Text>
                    <View style={{
                        flexDirection: 'row',
                        marginTop: '3%',
                        height: '100%'
                    }}>
                        {
                            isEdit ? (<TextInput style={styles.titleEdit}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</TextInput>) : (<Text style={[{ flex: 1 }, styles.category]}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</Text>)
                        }
                    </View>

                </View>



                <View style={{ width: '100%', height: 70, marginTop: isEdit ? '15%' : '-5%' }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Rating</Text>
                    <View style={{ width: '100%', marginTop: '3%', height: 30, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <Text>{item.Rating}</Text>
                        {images}
                    </View>
                </View>


                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '5%' : '5%',
                    height: 55,
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
                    marginTop: isEdit ? '5%' : '5%',
                    height: 55,
                }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Giá giao động</Text>
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
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Giờ mở cửa</Text>
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


                <View style={{
                    flexDirection: 'column',
                    marginTop: isEdit ? '15%' : '5%',
                    height: 205,
                }}>
                    <Text style={{ fontSize: 17, fontWeight: '600' }}>Tiện ích</Text>
                    {getPList()}
                </View>


                <View style={{ width: '100%', flexDirection: 'column', marginTop: '8%', height: '10%' }}>
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
                                numberOfLines={4}
                            >{item.Note}</Text>)
                    }
                </View>


                {
                    !isEdit ? (
                        <View style={{ width: '100%', flexDirection: 'column', marginTop: '15%', height: '22%' }}>
                            <Text style={{ fontSize: 17, fontWeight: '600' }}>Map</Text>
                            <MapView style={{ flex: 1, marginTop: '5%' }}
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
            </View>

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
        </ScrollView>
    )
}


