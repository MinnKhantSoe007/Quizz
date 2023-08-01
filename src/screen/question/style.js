import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  categoryItem: {
    paddingVertical: 25,
    marginTop: 50,
    marginBottom: 50
  },

  categoryTitle: {
    color: '#333',
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    // backgroundColor: '#F5F3F4',
    textAlign: 'center',
    // marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },
  itemWrapper:{marginVertical:10, backgroundColor:'#F5F3F4', borderRadius:10},
  createBtnWrapper:{backgroundColor:'#000',position: 'absolute', bottom:30,right:30,borderRadius:30 },
  createButton: {
    backgroundColor: '#000',
    width:60,
    height:60,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },

  plusBtn:{
    color:'#fff',
  },

  back: {
    position: 'absolute',
    top: 5,
    left: 20,
    flexDirection: "row"
  },

  icon_logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden'
  },

  logo_container: {
    marginLeft: 100,
    marginTop: 8,
  },

  profile_icon_logo: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden'
  },

  icon_text: {
    fontFamily: 'RobotoBold',
    fontSize: 23,
    marginTop: 10,
    marginLeft: 10
  },

  text: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  }

});