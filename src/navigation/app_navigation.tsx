import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import {MapScreen} from "../screens/map_screen.tsx"

const Stack = createStackNavigator();
export const AppNavigation = () => {
  return (
    <Stack.Navigator initialRouteName="BottomNavigation">
      <Stack.Screen
        name="MapScreen"
        // @ts-ignore
        component={MapScreen}
        options={{ headerShown: false }}
      />  
    </Stack.Navigator>
  );
};

