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
    color: '#000',
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    backgroundColor: '#F5F3F4',
    textAlign: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderRadius: 5,
  },

  createButton: {
    position: 'absolute',
    color: '#5E60CE',
    marginTop: 730,
    marginLeft: 300
  },

  back: {
    position: 'absolute',
    top: 30,
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