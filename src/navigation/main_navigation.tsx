import { Platform, SafeAreaView, View } from 'react-native';
import { MapScreen } from '../screens/map_screen.tsx';
import React from 'react';

export const AuthNavigation = () => {
  const NavigateToView = () => {
    return (
      <SafeAreaView style={{ flex: 1 }}>
          <MapScreen/>
      </SafeAreaView>
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
