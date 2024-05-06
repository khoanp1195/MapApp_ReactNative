
import { AuthNavigation } from "./src/navigation/main_navigation.tsx";
import { useCallback, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { DatabaseProvider } from "@nozbe/watermelondb/react";
import { database } from "./src/services/database/database.ts";
import { Provider, useDispatch } from 'react-redux';
import store from "./src/redux/stores.ts";
import 'react-native-gesture-handler'
import Geolocation from "@react-native-community/geolocation";
import { setLatitude, setLongtitude } from "./src/redux/location/reducer.ts";
import AppNavigator from "./src/navigation/AppNavigator.tsx";


function App() {
  return (
    <Provider store={store}>
    <NavigationContainer>
          <DatabaseProvider database={database}>
            <AuthNavigation />
           
          </DatabaseProvider>
        </NavigationContainer>
    </Provider>

  );
}

export default App;
