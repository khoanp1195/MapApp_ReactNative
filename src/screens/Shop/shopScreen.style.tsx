import { StyleSheet } from "react-native";
import { FontSize, dimensWidth } from "../../config/font";
import colors from "../../themes/Colors";

export const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: dimensWidth(15),
        marginBottom: dimensWidth(10),
        marginHorizontal: dimensWidth(15),
        borderRadius: 25,
        justifyContent: 'center',
    },
    container: {
        flexDirection: 'row', // Set flexDirection to 'row' for horizontal layout
    },
    text: {
        padding: 20,
        margin: 5,
        backgroundColor: '#eee',
    },
    image: {
        height: 30,
        width: 30,
        marginLeft: 10
    },
    sectionText: {
        color: 'black',
        fontSize: 16,
        fontFamily: 'WorkSans-Regular',
    },
    searchBar: {
        flex: 1,
        height: '100%',
        backgroundColor: "white",
        flexDirection: 'row',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 30
    },
    flexDirectionBetween: {
        flexDirection: 'column',
        width: '86%'
    },
    title: {
        fontSize: FontSize.LARGE,
        color: colors.textBlack19,
        fontWeight: '500',
        fontFamily: 'arial',
        marginBottom: 6,
        marginRight: dimensWidth(5),
    },
    date: {
        fontSize: dimensWidth(13),
        color: colors.lightBlack,
        fontWeight: '400',
        fontFamily: 'arial',
        marginBottom: 6,
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
        flexDirection: 'row',
        alignItems: 'center',
    },
    touchSendUnit: {
        backgroundColor: colors.lightBlue,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 3,
        alignSelf: 'baseline',
        marginRight: 10
    },
    textSendUnit: {
        fontSize: dimensWidth(12),
        color: colors.primary,
        fontWeight: '400',
        fontFamily: 'arial',
    },
    input: {
        flex: 1,
        paddingLeft: 10,
        fontWeight: '600',
        fontSize: 18,
        color: 'gray'
    },
});