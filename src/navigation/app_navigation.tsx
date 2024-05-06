import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MapScreen } from "../screens/Map/map_screen.tsx"
import {HomeScreen} from "../screens/Home/home_Screen.tsx"
import { Search_Screen } from "../screens/Search/search_Screen.tsx"
import { Shop_Screen } from "../screens/Shop/shop_Screen.tsx";
import { TabsScreen } from "../screens/tab/TabScreen.tsx";
import { Detail_shop_Screen } from "../screens/Detail/detail_shop_Screen.tsx";

const Stack = createStackNavigator();
export const AppNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="BottomNavigation">
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
    </Stack.Navigator>
  );
};

