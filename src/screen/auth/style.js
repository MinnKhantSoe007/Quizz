import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
  },

  create_input: {
    fontFamily: 'RobotoRegular',
    borderColor: '#5E60CE',
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 15
  },

  login_button: {
    backgroundColor: '#5E60CE',
    borderRadius: 10,
    marginHorizontal: 15
  },

  login_button_text: {
    fontFamily: 'RobotoRegular',
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20
  },

  auth_text: {
    fontFamily: 'RobotoBold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  }



})