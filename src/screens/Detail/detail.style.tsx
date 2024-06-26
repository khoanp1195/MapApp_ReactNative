import { StyleSheet } from "react-native";
import { FontFamily, dimensWidth } from "../../config/font";
import colors from "../../themes/Colors";
import { FontSize } from "../../themes/const";

export const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        padding: dimensWidth(10),
    },
    flexDirectionBetween: {
        flexDirection: 'column',
        width: '100%',
        padding:10
    },
    image: {
        height: 30,
        width: 30,

    },
      
    modalAdd: {
        width: '100%',
        height: 3500,
        flexDirection: 'column',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
      },
    touch: {
        padding: 6,
        position: 'absolute',
        zIndex: 99,
        top: 10,
        justifyContent: 'center',
        alignContent: 'center',
        borderRadius: 20,
        height: 40,
        width: 40,
        left: '3%',
        backgroundColor:'white'
    },
    textArea: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        height: 200,
        marginTop: '5%'
    },
    textNote: {
        width: '100%',
        height: 200,
        fontFamily: 'WorkSans-Medium',
    },
    input: {
        height: 48,
        color: 'black',
        fontSize: 16,
        fontFamily: 'WorkSans-Regular',
        textAlignVertical: 'top',
        borderWidth: 0.5
    },
    title: {
        fontSize: FontSize.LARGE_XX,
        color: colors.textBlack19,
        fontWeight: '600',
        fontFamily: 'arial',
        marginRight: dimensWidth(5),
        flex: 1,
        height: 40
    },

    titleEdit: {
        fontSize: FontSize.MEDIUM,
        color: colors.textBlack19,
        fontWeight: '400',
        fontFamily: 'arial',
        marginBottom: 6,
        marginRight: dimensWidth(5),
        flex: 1,
        marginTop: '3%',
        borderWidth: 0.5,
        padding: 5,
        borderRadius: 8
    },

    date: {
        fontSize: dimensWidth(13),
        color: colors.lightBlack,
        fontWeight: '400',
        fontFamily: 'arial',
        marginTop: '3%',
    },
    category: {
        fontSize: dimensWidth(13),
        color: colors.lightBlack,
        fontWeight: '400',
        fontFamily: 'arial',
        marginBottom: 6,
        marginRight: dimensWidth(5)
    },
    chuyenDonViRow: {
        flexDirection: 'column',
        marginTop: '2%',
    },
    checkBoxBtn: {
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        backgroundColor:'brown',
        height:100,
        width:100,
        
    },
    touchSendUnit: {
        backgroundColor: colors.lightBlue,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 10,
        alignSelf: 'baseline',
        marginRight: 10,
        alignItems: 'center',
    },
    textSendUnit: {


    },
});