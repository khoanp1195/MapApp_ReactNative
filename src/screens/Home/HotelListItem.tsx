import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Animated,
  ListRenderItemInfo,
  useWindowDimensions,
} from 'react-native';
// import { RatingBar } from '@aashu-dubey/react-native-rating-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HotelListType } from './model/hotel_list_data';
import { useSelector } from 'react-redux';
import { BlurView } from '@react-native-community/blur';


interface Props {
  data: any;
}

const HotelListItem: React.FC<Props> = ({ data }) => {
  const { item, index } = data;
  const { width } = useWindowDimensions();
  const translateY = useRef<Animated.Value>(new Animated.Value(50)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const { latitude, longtitude } = useSelector((state: any) => state.location)
  const imageSize = width - 48;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay: index * (400 / 3),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay: index * (400 / 3),
        useNativeDriver: true,
      }),
    ]).start();
  });

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
    return d.toFixed(3);
  };

  const calculateDistance = (currentLat: any, currentLon: any, markerLat: any, markerLon: any) => {
    return haversine(currentLat, currentLon, markerLat, markerLon);
  };


  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >

      <View style={styles.imageContainer}>
        <Image
          style={{ height: imageSize / 1.2, width: '100%' }}
          source={item.Image && item.Image != undefined ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
          resizeMode="stretch"
        />
        <Image
          source={require("../../assets/images/icon_favorite_home.png")}
          style={{ width: 10, height: 10, position: 'absolute', right: 10, top: 10, padding: 16 }}
        />
      </View>

      <View
        style={{
          overflow: 'hidden',
          alignSelf: 'center',
          position: 'absolute'
          , zIndex: 99,
          bottom: 10
          , width: '90%', height: '20%', borderRadius: 25,
        }}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={4}
        />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.review}>Khoảng cách: {calculateDistance(latitude, longtitude, item.latitude, item.longitude)} km</Text>
      </View>

    </Animated.View>
  );
};

const textStyle = {
  color: 'white',
  fontFamily: 'WorkSans-Regular',
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginVertical: 12,
    marginHorizontal: 14,
    borderRadius: 16,
    elevation: 8,
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    width: 250
  },
  imageContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    borderRadius: 30
  },
  title: {
    flex: 1,
    color: 'white',
    fontWeight:'600',
    fontSize: 22,
    fontFamily: 'WorkSans-SemiBold',
    alignSelf:'center'
  },
  subText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 4,
    marginTop: 4,
  },
  perNightPrice: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'WorkSans-SemiBold',
  },
  perNightText: { ...textStyle, color: 'black', marginTop: 4 },
  ratingContainer: {
    flexDirection: 'row',
    marginTop: 4,
    alignItems: 'center',
  },
  review: {
    ...textStyle,
    alignSelf:'center',
    marginBottom:10
  },
});

export default HotelListItem;



{/* <View style={{ padding: 8, paddingHorizontal: 16 }}>
<View style={{ flex: 1, flexDirection: 'row' }}>
  <Text style={styles.title}>{item.title}</Text>
  <Text style={styles.perNightPrice}>{item.perNight}</Text>
</View>
<View style={{ flexDirection: 'row' }}>
  <View style={styles.subText}>
    <Text style={[{ marginRight: 4 }, textStyle]}>{item.subTxt}</Text>
    <Icon name="location-pin" size={14} color="#54D3C2" />
    <Text style={textStyle}>
      {Number(item.dist.toPrecision(2))} km to city
    </Text>
  </View>
  <Text style={styles.perNightText}>/per night</Text>
</View> */}
{/* <View style={styles.ratingContainer}> */ }
{/* <RatingBar
    initialRating={item.rating}
    direction="horizontal"
    allowHalfRating
    itemCount={5}
    itemSize={24}
    glowColor="#54D3C2"
    ratingElement={{
      full: <Icon name="star-rate" color="#54D3C2" size={24} />,
      half: <Icon name="star-half" color="#54D3C2" size={24} />,
      empty: <Icon name="star-border" color="#54D3C2" size={24} />,
    }}
  /> */}

// </View>
// </View>