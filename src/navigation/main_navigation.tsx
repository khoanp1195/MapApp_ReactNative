import { Platform, SafeAreaView, View } from 'react-native';
import { MapScreen } from '../screens/Map/map_screen.tsx';
import React, { useEffect, useState } from 'react';
import { AppNavigation } from './app_navigation.tsx';
import { useDispatch } from 'react-redux';
import Geolocation from '@react-native-community/geolocation';
import { setLatitude, setLongtitude } from '../redux/location/reducer.ts';
import AppNavigator from './AppNavigator.tsx';

export const AuthNavigation = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const dispatch = useDispatch()
  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position: { coords: { latitude: any; longitude: any; }; }) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ latitude, longitude });
        dispatch(setLongtitude(longitude))
        dispatch(setLatitude(latitude))
      },
      (error: any) => {
        console.error('Error getting current position:', error);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  const fetchLocationName = async(latitude:any, longitude:any) =>{
    const url = ''
  }

  useEffect(() => {
    getCurrentPosition()
  }, [])


  const NavigateToView = () => {
    return (
      <View style={{ flex: 1 }}>
        {/* <AppNavigation /> */}
        <AppNavigator />
      </View>
    )
  }
  return Platform.OS == 'android' ? (
    <NavigateToView />
  ) : (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        marginBottom: 0,
        marginTop: 35,
      }}>
      <NavigateToView />
    </View >
  );
};
