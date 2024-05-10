import { ActivityIndicator, Alert, Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { Component, useCallback, useEffect, useRef, useState } from 'react'
import { MapData } from '../../services/database/models/MapData'
import { FontSize, dimensWidth } from '../../themes/const'
import colors from '../../themes/Colors'
import { AppBarCustom } from '../../component/AppBarCustom'
import { useNavigation } from '@react-navigation/native'
import FilterModal from '../../component/FiltersModal'
import MyPressable from '../../component/MyPressable'
import { useDispatch, useSelector } from "react-redux";
import { setIsUpdateFinish } from '../../redux/detail/reducer'
import SearchInput from '../../component/SearchInput'
import NoDataView from '../../component/NoDataView'
import { AppBarHeader } from '../../component/AppBarHeader'
import { BeanMapData } from '../../services/database/models/bean_map'
import { styles } from './shopScreen.style'
import * as Animatable from 'react-native-animatable';


export const Shop_Screen = () => {
    const [dataMark, setDataMark] = useState<BeanMapData[]>([])
    const [dataCategory, setDataCategory] = useState([])
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const navigation = useNavigation()
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false)
    const isUpdateFromDetail = useSelector((state: any) => state.detail.IsUpdate);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<BeanMapData[]>([])
    const dispatch = useDispatch();
    const viewRef = useRef(null);
    const [isChoseCategory, setIschoseCategory] = useState(false)
    const [categoryDatam, setCategoryData] = useState<BeanMapData[]>([])

    console.log("isUpdateFromDetail - here  1212213: " + isUpdateFromDetail)

    const ShopList = ({ item, index }: any) => {
        const images = []
        for (let i = 0; i <= item.Rating; i++) {
            images.push(
                <Image
                    source={require("../../assets/images/star.png")}
                    style={{ width: 20, height: 20, marginLeft: 5 }}
                />
            )
        }
        return (
            <Animatable.View
                animation={'fadeInLeftBig'}
                duration={1000}
                delay={index * 300}
            >
                <TouchableOpacity style={styles.item} onPress={() => {
                    // @ts-ignore
                    navigation.navigate("Detail_shop_Screen", { item: item });
                }}>

                    <View style={{ flex: 1 }}>
                        <Image
                            source={item.Image ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
                            defaultSource={require("../../assets/images/tinnoiboloading.png")}
                            resizeMode="stretch"
                            style={{ width: '100%', borderRadius: 20, height: 320, marginLeft: 5, alignSelf: 'center' }}
                        />

                        <View style={{ flexDirection: 'row', width: '100%', height: 50, marginTop: '3%' }}>
                            <View style={styles.flexDirectionBetween}>
                                <Text style={styles.title} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text style={styles.date}>{item.ShopCode}</Text>
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
                            flexDirection: 'row',
                            marginTop: '5%'
                        }}>

                            <Text style={[{ flex: 1 }, styles.category]}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</Text>
                        </View>

                        <View style={{ width: '100%', height: 30, flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                            <Text>{item.Rating}</Text>
                            {images}
                        </View>

                        <Text style={styles.title}></Text>

                        <View style={styles.chuyenDonViRow}>
                            <View style={styles.touchSendUnit}>
                                <Text style={styles.textSendUnit}>Đang mở cửa</Text>
                            </View>
                            <View style={[styles.flexDirectionBetween]}>
                                <Text
                                    style={[
                                        styles.date]}
                                >
                                </Text>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            </Animatable.View>

        );
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        setHasMoreData(true);
        setOffset(0);
        setSearchText("");
        fetchData();
        setDataMark([])
        setIschoseCategory(false)
    }, []);


    const handleSearch = (text: string) => {
        setIsLoadingMore(false);
        const filteredData = dataMark.filter(item => item.title.toLocaleLowerCase().includes(text.toLowerCase()))
        setSearchText(text);
        setFilteredData(filteredData);
    }

    // useEffect(() => {
    //     setIsLoadingMore(false);
    //     if (searchText != "" && searchText != undefined) {
    //         const filtered = dataMark.filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));
    //         // setDataMark(filtered);
    //         setFilteredData(filtered);
    //     }
    // }, [searchText])

    const fetchData = async () => {
        try {
            const data = await MapData.getAll(100, offset)
            if (data == undefined || (data.length === 0 || data.length < limit)) {
                // Nếu số lượng item trả về ít hơn limit hoặc bằng 0
                // setDataMark((prevData) => [...prevData, ...data]);
                setDataMark([...dataMark, ...data])
                setHasMoreData(false);
                // Alert.alert('Alert Title', 'fetchData - case 1', [
                //     {
                //       text: 'Cancel',
                //       onPress: () => console.log('Cancel Pressed'),
                //       style: 'cancel',
                //     },
                //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                //   ]);
            }
            else {
                // @ts-ignore
                setDataMark(((prevData) => [...prevData, ...data]));
                setOffset((prevOffset) => prevOffset + limit);
                // Alert.alert('Alert Title', 'fetchData - case 2', [
                //     {
                //       text: 'Cancel',
                //       onPress: () => console.log('Cancel Pressed'),
                //       style: 'cancel',
                //     },
                //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                //   ]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
            setRefreshing(false); // Khi kết thúc "refresh", cần đặt lại trạng thái
        }
    };

    useEffect(() => {
        fetchData()
        // Alert.alert('Alert Title', 'fetchData', [
        //     {
        //       text: 'Cancel',
        //       onPress: () => console.log('Cancel Pressed'),
        //       style: 'cancel',
        //     },
        //     {text: 'OK', onPress: () => console.log('OK Pressed')},
        //   ]);
    }, [])//isLoadingMore

    useEffect(() => {
        if (isLoadingMore) {
            fetchData()
            // Alert.alert('Alert Title', 'isLoadingMore', [
            //     {
            //       text: 'Cancel',
            //       onPress: () => console.log('Cancel Pressed'),
            //       style: 'cancel',
            //     },
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            //   ]);
        }
    }, [isLoadingMore])

    useEffect(() => {
        if (isUpdateFromDetail) {
            fetchData()
            dispatch(setIsUpdateFinish())
            // Alert.alert('Alert Title', 'isUpdateFromDetail', [
            //     {
            //       text: 'Cancel',
            //       onPress: () => console.log('Cancel Pressed'),
            //       style: 'cancel',
            //     },
            //     {text: 'OK', onPress: () => console.log('OK Pressed')},
            //   ]);
        }
    }, [isUpdateFromDetail])

    const UniqueCategoryList = () => {
        const uniqueCategories = new Set()
        dataMark.forEach(store => {
            // @ts-ignore
            uniqueCategories.add(store.Category)
        })
        const uniqueCategoriesArray = Array.from(uniqueCategories)
        return (
            <FlatList
                data={uniqueCategoriesArray}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal={true} 
            />
        )
    }

    const images = (img: string) => {
        switch (img) {
            case 'Coffee House':
                return require('../../assets/images/icon_CoffeeHouse.png')
            case 'Starbuck':
                return require('../../assets/images/starBuck_icon.jpg')
            case 'HighLand':
                return require('../../assets/images/highLand_icon.jpg')
        }
    };

    const choseCategory = (category: any) => {
        setIsLoadingMore(false);
        // @ts-ignore
        const filteredData = dataMark.filter(item => item.Category.includes(category))
        setCategoryData(filteredData);
    }

    // Render item function for the FlatList
    const renderItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => {
            setIschoseCategory(true)
            choseCategory(item)
        }} style={{
            margin: 5
            , marginLeft: 20,
            borderRadius: 10,
            width: 150,
            height: '90%',
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'row'
        }}>
            <Image
                // @ts-ignore
                source={images(item)}
                resizeMode='center'
                style={{ width: 40, borderRadius: 10, marginLeft: '5%', height: 40 }}
            />
            <Text style={{ marginLeft: '7%' }}>{item}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1 }}>
            {/* Header */}
            <AppBarCustom title={'Cửa hàng'} IsMap={false} />

            <View style={{
                flexDirection: 'row', width: '100%', height: 60,
                justifyContent: 'center',
                marginTop: '5%',
                alignItems: 'center'
            }}
            >
                <View style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '80%',
                    borderRadius: 30,
                    borderWidth: 1,
                    borderColor: 'white',
                    alignSelf: 'center',
                    flexDirection: 'row'
                }}>
                    <View style={styles.searchBar} onPress={() => {
                        // @ts-ignore
                        navigation.navigate('search_Screen')
                    }}>
                        <Image
                            style={{
                                // flex: 1,
                                height: '40%',
                                aspectRatio: 1,
                                marginLeft: 10,
                                justifyContent: 'center',
                                // backgroundColor: 'cyan'
                            }}
                            source={require('../../assets/images/icon_search26.png')}
                            resizeMode="stretch"
                        />
                        {/* <Text style={styles.input}>Tìm kiếm ở đây</Text> */}
                        <SearchInput
                            onChangeFilterText={handleSearch}
                            filterText={searchText}
                        />
                    </View>
                </View>

                <MyPressable
                    style={{ flexDirection: 'row', padding: 8 }}
                    onPress={() => setShowFilter(true)}
                >
                    <Image
                        style={styles.image}
                        source={require('../../assets/images/filter.png')}
                        resizeMode="contain"
                    />
                </MyPressable>
            </View>


            <View style={{ width: '100%', height: '7%', marginTop: '2%', flexDirection: 'row' }}>
                {/* <TouchableOpacity style={{
                    width: '15%',
                    height: '90%',
                    marginLeft: '5%',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.5
                }}>
                    <Text>All</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '25%',
                    height: '90%',
                    marginLeft: '5%',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.5
                }}>
                    <Text>Top Rated</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '25%',
                    height: '90%',
                    marginLeft: '5%',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 0.5
                }}>
                    <Text>Recently</Text>
                </TouchableOpacity> */}
                {
                    dataMark != undefined &&
                    UniqueCategoryList()
                }
            </View>

            <FlatList
                data={searchText != "" ? filteredData : isChoseCategory ? categoryDatam : dataMark}
                style={{ marginTop: '2%' }}
                renderItem={({ item, index }) => (
                    <ShopList item={item} index={index} />
                )}
                onEndReachedThreshold={0.1}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor='#0054AE' />
                }
                // @ts-ignore
                ListFooterComponent={isLoadingMore && (
                    <ActivityIndicator size="large" color="#006885" />
                )}
                onEndReached={() => {
                    if (searchText != "" && filteredData.length < 10) {
                        setIsLoadingMore(false)
                    }
                    if (searchText == "" && hasMoreData && !isLoadingMore) {
                        setIsLoadingMore(true);
                    }
                }}
                keyExtractor={(item, index) => item.ShopCode + '_' + index}
            />
            <FilterModal {...{ showFilter, setShowFilter }} />
        </View>
    )
}


