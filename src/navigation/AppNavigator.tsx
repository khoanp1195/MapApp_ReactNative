import React from 'react';
import { StatusBar, StyleSheet, useWindowDimensions } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { TabsScreen } from '../screens/tab/TabScreen';
import { HomeScreen } from '../screens/Home/home_Screen';
import { AppNavigation } from './app_navigation';
import { MapScreen } from '../screens/Map/map_screen';
import { Search_Screen } from '../screens/Search/search_Screen';
import { Shop_Screen } from '../screens/Shop/shop_Screen';
import { Detail_shop_Screen } from '../screens/Detail/detail_shop_Screen';
import DrawerContent from './DrawerContent';
import { Report_Screen, report_screen } from '../screens/Report/report_screen';

// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import {
//   HomeScene,
//   DrawerContent,
//   HelpScene,
//   FeedbackScene,
//   InviteFriendScene,
// } from '.';
// import { CourseInfoScreen, HomeDesignCourse } from './design_course';
// import { IntroductionAnimationScreen } from './introduction_animation';
// import HotelHomeScreen from './hotel_booking/HotelHomeScreen';

const Drawer = createDrawerNavigator();
/**
 * TODO:- Temporarily using r-nav-stack instead of r-nav-native-stack cause of following issue:
 * https://github.com/react-navigation/react-navigation/issues/10941
 * Replace with r-nav-native-stack, once this is fixed.
 */
const Stack = createStackNavigator();
// const Stack = createNativeStackNavigator();

const DrawerNavigator: React.FC = () => {
  const window = useWindowDimensions();
  const DrawerStack = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          width: window.width * 0.75,
          backgroundColor: 'rgb(237, 240, 242, 0.5)',
        },
        sceneContainerStyle: styles.drawerSceneContainer,
        drawerActiveBackgroundColor: '#5cbbff',
        drawerType: 'back',
        overlayColor: 'transparent',
        swipeEdgeWidth: window.width,
        headerShown: false,
      }}
      drawerContent={props => <DrawerContent {...props} />}
      // this is just to enable shadow/elevation style on drawer, as it fallback to JS drawer solution instead of native one (v6)
      // as explained here:- https://github.com/react-navigation/react-navigation/issues/10946#issuecomment-1287082343
      detachInactiveScreens={false}
    >
      <DrawerStack.Screen
        options={{ headerShown: false }}
        name="AppBottomStack"
        component={TabsScreen}
      />
      <Drawer.Screen name="HomeScreen1" component={HomeScreen} />
      <Drawer.Screen name="HomeScreen2" component={HomeScreen} />
      <Drawer.Screen name="HomeScreen3" component={HomeScreen} />
      <Drawer.Screen name="HomeScreen4" component={HomeScreen} />
    </Drawer.Navigator>
  );
};

export default () => {
  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle="dark-content"
        translucent
      />

      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
        <Stack.Screen
          name="BottomNavigation"
          component={TabsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="HomeScreen"
          // @ts-ignore
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MapScreen"
          // @ts-ignore
          component={MapScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="search_Screen"
          // @ts-ignore
          component={Search_Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Shop_Screen"
          // @ts-ignore
          component={Shop_Screen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Detail_shop_Screen"
          // @ts-ignore
          component={Detail_shop_Screen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Report_Screen"
          // @ts-ignore
          component={Report_Screen}
          options={{ headerShown: false }}
        />
        {/* <Stack.Screen name="BottomNavigation" component={TabsScreen} /> */}

        {/* <Stack.Screen name="Hotel" component={HotelHomeScreen} />

        <Stack.Group>
          <Stack.Screen name="DesignCourse" component={HomeDesignCourse} />
          <Stack.Screen name="CourseInfo" component={CourseInfoScreen} />
        </Stack.Group> */}

        {/* <Stack.Screen
          name="onBoarding"
          component={IntroductionAnimationScreen}
        /> */}
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  drawerSceneContainer: {
    elevation: 24,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.58,
    shadowRadius: 16.0,
  },
});
