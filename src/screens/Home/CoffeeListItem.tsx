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
import { RatingBar } from '@aashu-dubey/react-native-rating-bar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { HotelListType } from './model/hotel_list_data';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

interface Props {
  data: any;
}

const CoffeeListItem: React.FC<Props> = ({ data }) => {
  const { item, index } = data;
  const { width } = useWindowDimensions();
  const translateY = useRef<Animated.Value>(new Animated.Value(50)).current;
  const opacity = useRef<Animated.Value>(new Animated.Value(0)).current;
  const imageSize = width - 48;
  const images = []
  const navigation = useNavigation()
  for (let i = 1; i <= item.Rating; i++) {
    images.push(
      <Image
        source={require("../../assets/images/star.png")}
        style={{ width: 20, height: 20, marginLeft: 5 }}
      />
    )
  }

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

  return (
    <Animated.View
      style={[styles.container, { opacity, transform: [{ translateY }] }]}
    >
      <TouchableOpacity onPress={() => {
        // @ts-ignore
        navigation.navigate("Detail_shop_Screen", { item: item });
      }} style={styles.parent}>
        <View style={styles.imageContainer}>
          <Image
            source={item.Image && item.Image != undefined ? { uri: item.Image } : require("../../assets/images/tinnoiboloading.png")}
            style={{ height: '100%', width: '100%' }}
            defaultSource={require("../../assets/images/tinnoiboloading.png")}
            resizeMode="stretch"
          />


          <Image
            source={require("../../assets/images/icon_favorite_home.png")}
            style={{ width: 10, height: 10, position: 'absolute', right: 10, top: 10, padding: 16 }}
          />
        </View>
        <View style={{ padding: 8, width: '50%', paddingHorizontal: 16 }}>
          <View style={{ height: '20%', marginTop: '15%', flexDirection: 'row' }}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.perNightPrice}>{item.perNight}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginTop: '5%' }}>
            <View style={styles.subText}>
              <Text numberOfLines={2} style={[{ marginRight: 4 }, textStyle]}>{item.WardId}, {item.NumOfHouse}, {item.description}, {item.ProvinceId}</Text>
              {/* <Icon name="location-pin" size={14} color="#54D3C2" /> */}

              <Text style={textStyle}>
                {/* {Number(item.dist.toPrecision(2))} km  */}
              </Text>
            </View>
            {/* <Text style={styles.perNightText}>/per night</Text> */}
          </View>
          <View style={styles.ratingContainer}>
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
            <Text>{item.Rating}</Text>
            {images}
          </View>
        </View>
      </TouchableOpacity>

    </Animated.View>
  );
};

const textStyle = {
  color: 'rgba(128,128,128, 0.6)',
  fontFamily: 'WorkSans-Regular',
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginVertical: 12,
    marginHorizontal: 24,
    borderRadius: 16,
    elevation: 8,
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  parent: {
    flexDirection: 'row',
    backgroundColor: 'white',
    width: '100%',
    height: 200,
    borderRadius: 16,
    elevation: 8,
    shadowColor: 'grey',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  imageContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    width: '50%',
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    backgroundColor: 'transparent',
    height: '90%',
    alignSelf: 'center',
    marginLeft: '2%'
  },
  title: {
    flex: 1,
    color: 'black',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'WorkSans-SemiBold',
    height: '120%',
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
    marginLeft: 8,
  },
});

export default CoffeeListItem;
