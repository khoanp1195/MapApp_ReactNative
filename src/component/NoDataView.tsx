import React, {FC} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontSize} from '../config/font';
import colors from '../config/colors';
import {useDispatch, useSelector} from "react-redux";
import {ThunkDispatch} from "redux-thunk";

interface Props {
  onRetryPress?: () => any;
}

const NoDataView: FC<Props> = (props: Props) => {
  return (
    <View style={styles.viewNoData}>
      <Image source={require('../assets/images/icon_no_data.png')} style={{width:300,height:150, resizeMode:'stretch' }}/>
      <Text style ={{marginTop:17}}>No Data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  viewNoData: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNoData: {
    fontSize: FontSize.LARGE_X,
    color: 'grey',
  },
});

export default React.memo(NoDataView);
