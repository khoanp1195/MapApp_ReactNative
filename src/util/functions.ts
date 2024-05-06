import { Animated, Dimensions } from "react-native";

export const isNumber = (value: any) => {
  return typeof value === 'number' && !isNaN(value);
};
export const isNullOrEmpty = (data: string | null) => {
  return data == undefined || data == null || (data != undefined && data != null && data === '');
};

export const fadeInPressableAnimation = () => {
  //@ts-ignore
  Animated.timing(animated, {
    toValue: 0.4,
    duration: 100,
    useNativeDriver: true,
  }).start();
};

export const fadeOutPressableAnimation = () => {
  //@ts-ignore
  Animated.timing(animated, {
    toValue: 1,
    duration: 200,
    useNativeDriver: true,
  }).start();
};

export const haversine = (lat1: any, lon1: any, lat2: any, lon2: any) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};