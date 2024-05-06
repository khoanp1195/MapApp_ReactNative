import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checkBoxBtn: {
      alignSelf: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      padding: 8,
    },
    bottomSheetStyle: {
      backgroundColor: '#F2F3F7',
      borderRadius: 12
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center'
    },
    containerHeadline: {
      fontSize: 24,
      fontWeight: '600',
      padding: 20
    },
    input: {
      flex: 1,
      paddingLeft: 10,
      fontWeight: '500',
      fontSize: 17,
      color: 'gray'
    },
    inputEdit: {
      flex: 1,
      paddingLeft: 10,
      fontWeight: '500',
      fontSize: 17,
      color: 'gray',
      height: '10%'
  
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 75,
    },
    tienIchField: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      height: 220,
      marginTop: '2%'
    },
    searchBar: {
      flex: 1,
      height: 40,
      backgroundColor: "#f5f5f5",
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    icon: {
      width:30,
      height:30
    },
    icon_list: {
      width: 30,
      height: 30
    },
    containerStyle: {
      backgroundColor: 'rgba(128, 128, 128, 0.6)'
    },
    dotsWrapper: {
      height: 100,
      justifyContent: 'center',
      marginTop: '60%',
      position: 'absolute',
      alignSelf: 'center',
  
      zIndex: 1
    },
    loading: {
      width: 100,
      height: 100,
      borderRadius: 30,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '20%',
      top: '50%',
    },
    icon_attach: {
      width: 50,
      height: 50,
      borderRadius: 15,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '84%',
      top: '34%',
      backgroundColor:'white',
      shadowColor: '#000',
      shadowOpacity: 0.2, 
      shadowRadius: 10, 
      elevation: 5,   
      justifyContent:'center',
      alignContent:'center',
      alignItems:'center'
  
    },
    icon_position: {
      width: 50,
      height: 50,
      borderRadius: 15,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '84%',
      top: '27%',
      backgroundColor:'white',
      shadowColor: '#000',
      shadowOpacity: 0.2, 
      shadowRadius: 10, 
      elevation: 5,   
      justifyContent:'center',
      alignContent:'center',
      alignItems:'center'
    },
    icon_reload: {
      width: 50,
      height: 50,
      borderRadius: 15,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '84%',
      top: '20%',
      backgroundColor:'white',
      shadowColor: '#000',
      shadowOpacity: 0.2, 
      shadowRadius: 10, 
      elevation: 5,   
      justifyContent:'center',
      alignContent:'center',
      alignItems:'center'
    },
    icon_home: {
      width: 50,
      height: 50,
      borderRadius: 30,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '84%',
      top: '96%',
    },
    icon_loadMore: {
      width: 50,
      height: 50,
      borderRadius: 30,
      zIndex: 1,
      position: 'absolute',
      top: 100,
      left: '84%',
      top: '63%',
    },
    markerImage: {
      width: 40, // specify your desired width
      height: 40, // specify your desired height
      borderRadius: 20,
      shadowColor: 'black',
      shadowOffset: {
        width: 2, // horizontal offset
        height: 2, // vertical offset
      },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 5, // for Android shadow
    },
  
    positionImage: {
      width: 30, // specify your desired width
      height: 30, // specify your desired height
      alignSelf: 'center'
    },
  
    modalAdd: {
      width: '100%',
      height: 3500,
      flexDirection: 'column',
      alignSelf: 'center',
      backgroundColor: 'white',
      borderRadius: 10,
      
  
    },
    formContainer: {
      backgroundColor: 'white',
      padding: 10,
      elevation: 3,
      height: 370,
      marginTop: '1%'
    },
    line2: {
      width: '100%',
      marginTop: '6%',
      height: 0.6,
      backgroundColor: '#C0C0C0',
    },
    line3: {
      width: '100%',
      height: 0.6,
      backgroundColor: '#C0C0C0',
    },
    lineChild: {
      width: '100%',
      marginTop: '3%',
      height: 0.6,
      marginLeft: '16%',
      backgroundColor: '#C0C0C0',
    },
  });