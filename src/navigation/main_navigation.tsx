import { Platform, SafeAreaView, View } from 'react-native';
import { AppNavigation } from "./app_navigation.tsx";
import { MapScreen } from '../screens/map_screen.tsx';

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        width: '100%',
        height: '100%',
        marginBottom: 0,
        marginTop: 35,
      }}>
      <NavigateToView />
    </SafeAreaView >
  );
};
