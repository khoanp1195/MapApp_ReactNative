// import React, {FC, useEffect, useState} from 'react';
// import {StyleSheet, Text, TouchableHighlight, TouchableOpacity, View} from 'react-native';
// import {FastImageCustom} from './FastImageCustom';
// import TextCusTom from './TextCusTom';
// import {FontSize} from "../config/font";
// import colors from "../config/colors";
// import {NotificationIcon} from "assets/svg";
// import {currentUserStore} from "../config/constants";
// import {useNavigation} from "@react-navigation/native";
// import {useSelector} from "react-redux";

// const AppBarDCM: any = ({ children,  notificationCount = '0', title,onPress, ...props }: any) => {
//     const navigation=useNavigation();
//     const {isHomePage} = useSelector((state: any) => state.appbar);

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity onPress={onPress}>
//                 <FastImageCustom urlOnline={currentUserStore.getCurrentUser().ImagePath} defaultImage={require('assets/images/img_avatar_grey.png')}/>
//             </TouchableOpacity>
//             <TextCusTom allowFontScaling={false} {...props} i18nKey={title} style={styles.textTitle} />
//             {
//                 isHomePage &&<View style={styles.viewRight}>

//                     <TouchableOpacity onPress={()=>{
//                         // @ts-ignore
//                         navigation.navigate('notification');
//                     }}>
//                         <NotificationIcon />
//                         {
//                             notificationCount!=0&&<View style={styles.viewNotification}>
//                                 <TextCusTom i18nKey={notificationCount} style={styles.textNotification} />
//                             </View>
//                         }
//                     </TouchableOpacity>
//                 </View>
//             }
//         </View>
//     );
// };
// const styles = StyleSheet.create({
//     container: { height:80, flexDirection: 'row', alignItems: 'center', padding: 20, backgroundColor: colors.white },
//     textTitle: { fontSize: FontSize.LARGE_XX, fontWeight: '700', color: colors.DarkCyan },
//     viewRight: { flex: 1, alignItems: 'flex-end' },
//     viewNotification: { backgroundColor: colors.red, height: 20, width: 20, borderRadius: 10, position: 'absolute', right: -7, top: -5, justifyContent: 'center', alignItems: 'center' },
//     textNotification: { color: colors.white, fontSize: 12, }
// });
// export default React.memo(AppBarDCM);
