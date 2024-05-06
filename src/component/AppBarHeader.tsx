import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import MyPressable from './MyPressable'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const AppBarHeader = ({title}: any) => {
    const navigation = useNavigation()
    const inset = useSafeAreaInsets();
    const window = useWindowDimensions();
  return (
    <View
    style={[
        styles.header,
        { height: 52 + inset.top, paddingTop: inset.top },
    ]}
>
    <View style={styles.headerLeft}>
        <MyPressable
            style={{ marginLeft: 8 }}
            android_ripple={{ color: 'grey', radius: 20, borderless: true }}
            touchOpacity={0.6}
            onPress={() => navigation.toggleDrawer()}
        >
         <Image
                style={styles.image}
                source={require('../assets/images/icon_menu.png')}
                resizeMode="contain"
            />
        </MyPressable>
    </View>
    <View
        style={{
            marginHorizontal: 16,
            maxWidth: window.width - 16 - 32 - 41 - 74, // 16, 32:- total padding/margin; 41, 74:- left and right view's width
        }}
    >
        <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
        </Text>
    </View>
    <View style={styles.headerRight}>
        {/* <Icon
            style={{ paddingRight: 8 }}
            name="favorite-border"
            size={25}
            color="black"
        />
        <Icon
            style={{ paddingHorizontal: 8 }}
            name="location-pin"
            size={25}
            color="black"
        /> */}
        <TouchableOpacity onPress={() => {
            // @ts-ignore
            navigation.navigate('MapScreen')
        }}>
            <Image
                style={styles.image}
                source={require('../assets/images/icon_map_home.png')}
                resizeMode="contain"
            />
        </TouchableOpacity>
    </View>
</View>
  )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgrey',
    },
    headerLeft: {
        alignItems: 'flex-start',
        flexGrow: 1,
        flexBasis: 0,
    },
    image: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    headerTitle: {
        color: 'black',
        fontSize: 22,
        fontFamily: 'WorkSans-SemiBold',
        textAlign: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexGrow: 1,
        flexBasis: 0,
    },
})

