import { StyleSheet } from "react-native";
import React from "react";
import TextInputCustom from "./TextInputCustom";
import colors from "../themes/Colors";
import { FontSize, dimensWidth } from "../themes/const";
interface Props {
  filterText: string;
  onChangeFilterText: (text: string) => void;
}
const SearchInput = ({ filterText, onChangeFilterText }: Props) => {
  return (
    <TextInputCustom
      placeholder="Tìm kiếm …"
      placeholderTextColor={colors.lightBlack}
      numberOfLines={1}
      onChangeText={(text) => onChangeFilterText(text)}
      value={filterText}
      autoCapitalize="none"
      style={styles.userNameInput}
    />
  );
};
const styles = StyleSheet.create({
  userNameInput: {
    marginHorizontal: 0,
    paddingStart: 15,
    backgroundColor: colors.white,
    width:'85%',
    borderRadius: dimensWidth(18),
    color: colors.lightBlack,
    fontSize: FontSize.SMALL,
    height: dimensWidth(37),
    justifyContent: 'center'
  },
});
export default SearchInput;
