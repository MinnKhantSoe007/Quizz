import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    flex: 1
  },

  image: {
    height: 300,
    width: 300,
  },

  image_container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 110
  },

  title_container: {
    marginTop: 20
  },

  title: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    color:'#00000088',
    paddingHorizontal:20,
    letterSpacing:2,
    textAlign: 'center',
  },

  add_btn_container: {
    marginTop: 70,
    marginHorizontal: 15
  },

  add_btn: {
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    backgroundColor: '#5E60CE',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    textAlign: 'center',
    color:'#fff'
  },

  start_btn_container: {
    marginTop: 30,
    marginHorizontal: 15,
    marginBottom: 70
  },

  start_btn: {
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    backgroundColor: '#5E60CE',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 10,
    textAlign: 'center',
    color:'#fff'
  }

})