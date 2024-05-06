import React, { useEffect, useState } from "react";
import { Alert, BackHandler, Keyboard, Text, View } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";
import { AppBarCustom } from '../../component/AppBarCustom';
import { BottomNavigationContainer } from "../../navigation/bottomNavigation";

export const TabsScreen = () => {
    return <>
        <BottomNavigationContainer />
    </>;
};
