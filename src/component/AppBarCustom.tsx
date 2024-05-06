import { Alert, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Platform, NativeModules } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setIsUpdateHome } from "../redux/detail/reducer";
import MapView from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { setIsStandard, setIssatellite } from "../redux/appbarcustom/reducer";

// @ts-ignore
export const AppBarCustom = ({ title,IsMap }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity style={styles.touch} onPress={() => {
                dispatch(setIsUpdateHome())
                navigation.goBack();
            }}>
                <Image
                    style={styles.image}
                    source={require('../assets/images/icon_back.png')}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <Text style={styles.text}>{title}</Text>
            {
                IsMap ? <View style={{
                    height: 50,
                    width: '50%',
                    marginTop:'3%',
                    flexDirection: 'row',
                    backgroundColor: 'whtie',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'center'
                }}>
                    <TouchableOpacity onPress={()=>{
                        dispatch(setIsStandard())
                    }}
                     style={{
                        elevation: 8,
                        shadowColor: 'lightgrey',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        borderRadius: 15,
                        width: '40%',
                        height: '80%',
                        marginRight: '5%', backgroundColor: 'blue'
                    }}>
                    <MapView 
                        mapType= {'standard'}
                        style={{flex:1,borderRadius:15}}></MapView>
    
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        dispatch(setIssatellite())
                    }} style={{
                        elevation: 8,
                        shadowColor: 'lightgrey',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 4.65,
                        borderRadius: 15,
                        width: '40%',
                        height: '80%',
                        backgroundColor: 'blue'
                    }}>
                        <MapView 
                        mapType= {'satellite'}
                        style={{flex:1,borderRadius:15}}></MapView>
    
                    </TouchableOpacity>
                </View> : null
            }
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    text: {
        color: '#006885',
        fontSize: 20,
        fontFamily: 'heritage_bold',
        lineHeight: 24,
        flex: 1,
        fontWeight: '600'
    },
    image: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    touch: {
        padding: 6
    },
    rightControl: {
        // Tùy chỉnh kiểu dáng của control bên phải ở đây
    },
    container: {
        height: 80,
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
        alignContent:'center'
    },
    img_dowload: {
        height: 30,
        width: 30,
        marginRight: 20
    }
});
