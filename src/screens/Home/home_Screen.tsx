import { View, Text, StyleSheet, FlatList, useWindowDimensions, TextInput, ListRenderItemInfo, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import FilterModal from '../../component/FiltersModal';
import CustomerCalendar from '../../component/CalendarPopupView';
import MyPressable from '../../component/MyPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HOTEL_LIST, HotelListType } from './model/hotel_list_data';
import HotelListItem from './HotelListItem';
import { ScrollView } from 'react-native-gesture-handler';
import CoffeeListItem from './CoffeeListItem';
import { useDispatch, useSelector } from 'react-redux';
import { MapData } from '../../services/database/models/MapData';
import NoDataView from '../../component/NoDataView';
import { AppBarHeader } from '../../component/AppBarHeader';
import Lottie from 'lottie-react-native'
import LottieView from 'lottie-react-native';
import { setIsUpdateFinish, setIsUpdateFinishHome } from '../../redux/detail/reducer';
import { NotificationIcon } from '../../assets/svg';

const HALF_MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'July',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
interface MapDataState {
    latitude: number,
    longitude: number,
    title: string,
    description: string,
    NumOfHouse: string,
    ShopCode: string,
    ProvinceId: string,
    DistrictId: string,
    WardId: string

}

export const HomeScreen = () => {
    const window = useWindowDimensions();
    const inset = useSafeAreaInsets();
    const navigation = useNavigation();
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() + 5);
        return date;
    });
    const [showCal, setShowCal] = useState<boolean>(false);
    const [dataMark, setDataMark] = useState<MapDataState[]>([])
    const [dataRecentYou, setdataRecentYou] = useState<MapDataState[]>([])
    const [offset, setOffset] = useState(0)
    const [limit, setLimit] = useState(10)
    const [hasMoreData, setHasMoreData] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(true)
    const [showFilter, setShowFilter] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false)
    const IsUpdateFromHome = useSelector((state: any) => state.detail.setIsUpdateHome);
    const isUpdateFromDetail = useSelector((state: any) => state.detail.IsUpdate);
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState<MapDataState[]>([])
    const { latitude, longtitude } = useSelector((state: any) => state.location)
    const dispatch = useDispatch();
    
    const calculateDistance = (lat1: any, lon1: any, lat2: any, lon2: any) => {
        const R = 6371e3; // meters (Earth's radius)
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δφ = φ2 - φ1;
        const λ1 = toRadians(lon1);
        const λ2 = toRadians(lon2);
        const Δλ = λ2 - λ1;
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(toRadians(φ1)) * Math.cos(toRadians(φ2)) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // distance in meters
    };
    const toRadians = (angle: number) => angle * Math.PI / 180;

    const distanceRecentData = useCallback(async () => {
        try {
            const fetchedData = await MapData.getAll(10, 0)
            const filteredData = fetchedData.filter(item => {
                const distance = calculateDistance(
                    latitude,
                    longtitude,
                    item.latitude,
                    item.longitude
                )
                return distance <= 10000
            })
            setdataRecentYou(filteredData)
        }
        catch (error) {
            console.log(error)
        }
        finally {
            setIsLoadingMore(false);
            setRefreshing(false);
        }
        setIsLoadingMore(false);
    },[latitude,longtitude])

    const topCoffeeData = async () =>{
        try
        {
            const fetchData = await MapData.getAll(10,0)
            const filteredData = fetchData.filter(item => item.Rating >= 4)
            setDataMark(filteredData)
            console.log("TopCoffeeData data: " + filteredData )

        }catch(error)
        {
            console.log("TopCoffeeData failed to fetch data: " + error )
        }
        finally{
            setIsLoadingMore(false);
            setRefreshing(false);
        }
        setIsLoadingMore(false);
    }

    const fetchData = async () => {
        try {
            const data = await MapData.getAll(10, 0)
            setDataMark(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingMore(false);
            setRefreshing(false); // Khi kết thúc "refresh", cần đặt lại trạng thái
        }
        setIsLoadingMore(false)

    };
    useEffect(() => {
        distanceRecentData()
        topCoffeeData()
    }, [latitude,longtitude])

    useEffect(() => {
        if (IsUpdateFromHome || isUpdateFromDetail) {
            distanceRecentData()
            topCoffeeData()
            fetchData()
            dispatch(setIsUpdateFinishHome())
        }
    }, [IsUpdateFromHome,isUpdateFromDetail])
    console.log("IsUpdateFromHome - here: " + IsUpdateFromHome)


    const contentHeaderCoffee = (
        <View style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
            <View style={{ flexDirection: 'row', height: 50, alignItems: 'center' }}>
                <Text style={{ marginLeft: '5%', width: '78%', fontSize: 20, fontWeight: '600' }}>
                    Top Coffee
                </Text>
                <TouchableOpacity style={{}}>
                    <Text style={{ fontSize: 17, color: 'gray' }}>View All</Text>
                </TouchableOpacity>
            </View>
        </View>

    )

    const contentHeader = (
        <View style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
            <View style={{ flexDirection: 'row', padding: 16 }}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="London..."
                    placeholderTextColor="#3c3c434c"
                    selectionColor="#54D3C2"
                />
                <View style={styles.searchBtnContainer}>
                    <MyPressable
                        style={styles.searchBtn}
                        android_ripple={{ color: 'grey', radius: 28, borderless: true }}
                        touchOpacity={0.6}
                    >
                        {/* <Icon name="search" size={30} color="white" /> */}
                    </MyPressable>
                </View>
            </View>
            <View style={styles.headerDetailContainer}>
                <MyPressable
                    style={styles.headerSectionContainer}
                    touchOpacity={0.6}
                    onPress={() => setShowCal(true)}
                >
                    <Text style={styles.headerDetailTitle}>Choose date</Text>
                    <Text style={styles.sectionText}>
                        {`${String(startDate.getDate()).padStart(2, '0')}, ${HALF_MONTHS[startDate.getMonth()]
                            } - ${String(endDate.getDate()).padStart(2, '0')}, ${HALF_MONTHS[endDate.getMonth()]
                            }`}
                    </Text>
                </MyPressable>
                <View style={styles.verticalDivider} />
                <View style={styles.headerSectionContainer}>
                    <Text style={styles.headerDetailTitle}>Number of Rooms</Text>
                    <Text style={styles.sectionText}>1 Room - 2 Adults</Text>
                </View>
            </View>
        </View>
    );

    const renderItem = useCallback(
        (data: any) =>
            data.index >= 0 ? (
                <HotelListItem {...{ data }} />
            ) : null,
        [],
    );

    const renderItemCoffee = useCallback(
        (data: any) =>
            data.index >= 0 ? (
                <CoffeeListItem {...{ data }} />
            ) : null,
        [],
    );
    return (
        <>
            {/* Header */}
            <AppBarHeader title={'Home'} />

            <ScrollView style={{ flex: 1, backgroundColor: 'rgb(242, 242, 242)' }}>
                <View style={{width:'100%',height:'10%',flexDirection:'row'}}>
                    <View style={{width:'60%',height:'100%', flexDirection:'column',
                        justifyContent:'center',
                    }}>
                        <View style={{marginLeft:'8%'}}>
                        <Text style={{color:'gray',fontSize:16}}>Your Location</Text>
                            <Text style={{fontSize:17,fontWeight:'600', marginTop:'4%'}}>HO CHI MINH CITY</Text>
                        </View>
                    </View>
                    <View style={{ width:'40%',flexDirection:'row',
                    justifyContent:'center',
                    alignContent:'center',
                    alignItems:'center'

                }}>
                    <TouchableOpacity style={{width:'20%',height:'32%',backgroundColor:'white', borderRadius: 40,
                    justifyContent:'center',
                    alignContent:'center',
                    alignItems:'center'
                            }}>
                                   <NotificationIcon />


                            </TouchableOpacity>
                            <TouchableOpacity style={{width:80,height:80,backgroundColor:'blue',borderRadius:40
                            ,marginLeft:'5%'
                            }}>
                                        <Image
                            source={ require("../../assets/images/img_defaultGirl.png")}
                            resizeMode="stretch"
                            style={{ width: '100%', borderRadius: 80, height: 80, alignSelf: 'center' }}
                        />
                            </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.container}>
                    <View style={{ backgroundColor: 'rgb(242, 242, 242)' }}>
                        <View style={{ flexDirection: 'row', padding: 16 }}>
                            <TextInput
                                style={styles.searchInput}
                                placeholder="London..."
                                placeholderTextColor="#3c3c434c"
                                selectionColor="#54D3C2"
                            />
                            <View style={styles.searchBtnContainer}>
                                <MyPressable
                                    style={styles.searchBtn}
                                    android_ripple={{ color: 'grey', radius: 28, borderless: true }}
                                    touchOpacity={0.6}
                                >
                                    <Image
                                        style={{
                                            height: 20,
                                            aspectRatio: 1,
                                            justifyContent: 'center',

                                        }}
                                        source={require('../../assets/images/icon_search26.png')}
                                        resizeMode="stretch"
                                    />
                                </MyPressable>
                            </View>
                        </View>


                        {/* <View style={styles.headerDetailContainer}>
                            <MyPressable
                                style={styles.headerSectionContainer}
                                touchOpacity={0.6}
                                onPress={() => setShowCal(true)}
                            >
                                <Text style={styles.headerDetailTitle}>Choose date</Text>
                                <Text style={styles.sectionText}>
                                    {`${String(startDate.getDate()).padStart(2, '0')}, ${HALF_MONTHS[startDate.getMonth()]
                                        } - ${String(endDate.getDate()).padStart(2, '0')}, ${HALF_MONTHS[endDate.getMonth()]
                                        }`}
                                </Text>
                            </MyPressable>
                            <View style={styles.verticalDivider} />
                            <View style={styles.headerSectionContainer}>
                                <Text style={styles.headerDetailTitle}>Number of Rooms</Text>
                                <Text style={styles.sectionText}>1 Room - 2 Adults</Text>
                            </View>
                        </View> */}

                        {/* <View style={{ width: '100%', height: 40, marginTop: '2%', flexDirection: 'row' }}>


                            TẠM ĐÓNG 9.1.2024
                            <TouchableOpacity style={{
                                width: '15%',
                                height: '90%',
                                marginLeft: '5%',
                                borderRadius: 30,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white'

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
                                backgroundColor: 'white'

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
                                backgroundColor: 'white'
                            }}>
                                <Text>Recently</Text>
                            </TouchableOpacity>

                        </View> */}
                    </View>
                    <View style={styles.stickyHeaderContainer}>
                        <Text style={styles.hotelCountText}>Coffee Recently You</Text>
                        <View style={{ borderRadius: 4, overflow: 'hidden' }}>
                            <MyPressable
                                style={{ flexDirection: 'row', padding: 8 }}
                                onPress={() => setShowFilter(true)}
                            >
                                <Text style={styles.sectionText}>Filter</Text>
                                <Image
                                    style={styles.image}
                                    source={require('../../assets/images/filter.png')}
                                    resizeMode="contain"
                                />
                            </MyPressable>
                        </View>
                    </View>

                    {dataMark != undefined && dataMark.length > 0 ? (
                        <FlatList
                            contentContainerStyle={[styles.list, { paddingBottom: inset.bottom }]}
                            horizontal // Set horizontal to true
                            stickyHeaderIndices={[1]}
                            nestedScrollEnabled
                            // ListHeaderComponent={contentHeader}
                            data={dataRecentYou}
                            renderItem={renderItem}
                            keyExtractor={item => item.id.toString()}
                        />) : (
                        <View style={[styles.list, { paddingBottom: inset.bottom }]}>
                            {contentHeaderCoffee}
                            <LottieView
                                source={require('../../assets/lottie/nodata.json')}
                                autoPlay={true}
                                loop={true}
                                style={{ width: '100%', height: '58%', backgroundColor: 'transparent' }}
                            />
                        </View>
                    )}
                </View>


                <View style={styles.container_section2}>
                    {
                        dataMark != undefined && dataMark.length > 0 ? (
                            <FlatList
                                contentContainerStyle={[styles.list, { paddingBottom: inset.bottom }]}
                                stickyHeaderIndices={[1]}
                                nestedScrollEnabled
                                ListHeaderComponent={contentHeaderCoffee}
                                data={dataMark}
                                renderItem={renderItemCoffee}
                                keyExtractor={item => item.id.toString()}
                            />
                        ) : (
                            <View style={[styles.list, { paddingBottom: inset.bottom }]}>
                                {contentHeaderCoffee}
                                <LottieView
                                    source={require('../../assets/lottie/nodata.json')}
                                    autoPlay={true}
                                    loop={true}
                                    style={{ width: '100%', height: '150%', backgroundColor: 'transparent' }}
                                />
                            </View>
                        )
                    }

                </View>
            </ScrollView>


            <CustomerCalendar
                {...{ showCal, setShowCal }}
                minimumDate={new Date()}
                initialStartDate={startDate}
                initialEndDate={endDate}
                onApplyClick={(startData, endData) => {
                    if (startData != null && endData != null) {
                        setStartDate(startData);
                        setEndDate(endData);
                    }
                }}
            />
            <FilterModal {...{ showFilter, setShowFilter }} />
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgrey',
    },
    image: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    headerLeft: {
        alignItems: 'flex-start',
        flexGrow: 1,
        flexBasis: 0,
    },
    headerTitle: {
        color: 'black',
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
        textAlign: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexGrow: 1,
        flexBasis: 0,
    },
    container: {
        backgroundColor: 'rgb(242, 242, 242)',
    },
    container_section2: {
        flex: 1,
        backgroundColor: 'rgb(242, 242, 242)',
    },
    list: {
        flexGrow: 1,
        backgroundColor: 'rgb(242, 242, 242)',
    },
    searchInput: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 32,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginRight: 16,
        color: 'black',
        fontSize: 18,
        elevation: 8,
        shadowColor: 'lightgrey',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    searchBtnContainer: {
        borderRadius: 36,
        elevation: 12,
    },
    searchBtn: {
        padding: 12,
        backgroundColor: '#54D3C2',
        borderRadius: 36,
        shadowColor: 'grey',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    headerDetailContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerDetailTitle: {
        color: 'darkgrey',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: 'WorkSans-Regular',
    },
    sectionText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'WorkSans-Regular',
    },
    verticalDivider: {
        width: 1,
        backgroundColor: 'darkgrey',
        marginRight: 8,
        marginVertical: 8,
    },
    headerSectionContainer: {
        flex: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    stickyHeaderContainer: {
        backgroundColor: 'rgb(242, 242, 242)',
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingVertical: 8,
    },
    hotelCountText: {
        flex: 1,
        color: 'black',
        fontSize: 20,
        fontWeight: '600',
        alignSelf: 'center',
        fontFamily: 'WorkSans-Regular',
    },
});
