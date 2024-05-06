import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Agenda } from 'react-native-calendars';
import { AppBarHeader } from '../../component/AppBarHeader';

const calendar_screen = () => {
  return (
    <View style={styles.container}>
      <AppBarHeader title={'Calendar'} />

      <Agenda
        selected="2022-12-01"
        items={{
          '2022-12-01': [{ name: 'Cycling',dsc:"coding" }, { name: 'Walking' }, { name: 'Running' }],
          '2022-12-02': [{ name: 'Writing' }]
        }}
        renderItem={(item, isFirst) => (
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>{item.dsc}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default calendar_screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  }
});