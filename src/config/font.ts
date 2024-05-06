import {Dimensions} from "react-native";

export const windowWidth = Dimensions.get('window').width;
export const dimensWidth = (width: any) => (width * windowWidth) / 414;
export const windowHeight = Dimensions.get('window').height;
export const dimnensHeight = (height: any) => (height * windowHeight) / 736;
export const FontSize = {
    SMALL1: dimensWidth(12),
    SMALL: dimensWidth(14),
    TEXT15: dimensWidth(15),
    MEDIUM: dimensWidth(16),
    LARGE: dimensWidth(18),
    LARGE_X: dimensWidth(20),
    LARGE_XX: dimensWidth(22),
    LARGE_XXX: dimensWidth(24),
};
export const FontFamily = {
    HERITAGE_BOLD: 'heritage_bold', //fontStyle="normal",fontWeight="800"
    HERITAGE_ITALIC: 'heritage_italic', //fontStyle="italic",fontWeight="400"
    HERITAGE_REGULAR: 'heritage_regular' //fontStyle="normal",fontWeight="400"
}
