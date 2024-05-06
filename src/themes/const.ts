import {Dimensions} from 'react-native';

export enum barStyle {
  darkContent = 'dark-content',
  lightContent = 'light-content',
}
const windowWidth = Dimensions.get('window').width;
export const dimensWidth = (width: any) => (width * windowWidth) / 414;
export const windowHeight = Dimensions.get('window').height;
export const dimnensHeight = (height: any) => (height * windowHeight) / (896);
export const FontSize = {
  SMALL: dimensWidth(14),
  MEDIUM: dimensWidth(16),
  LARGE: dimensWidth(18),
  LARGE_X: dimensWidth(20),
  LARGE_XX: dimensWidth(22),
  LARGE_XXX: dimensWidth(24),
};
export const RESONSE_STATUS_SUCCESS = "SUCCESS";
export const RESONSE_STATUS_NONE = "NONE";
