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
    marginHorizontal: 15,
    marginBottom: 30
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
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
},

modalView: {
    marginTop: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 7,
    elevation: 9,
  },

  success: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
  },

  check: {
    fontFamily: 'RobotoRegular',
    marginTop: 5,
  },

  ok: {
    fontFamily: 'RobotoRegular',
    color: '#5E60CE',
    fontSize: 20,
    marginTop: 10
  },

  photoButton: {
    backgroundColor: "#5E60CE",
    width: 100,
    height: 100,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 30
  },

  photoButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#000",
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 20
  },

  selectedPic: {
    width: 100,
    height: 100,
    marginBottom: 30,
    borderRadius: 10,
    alignSelf: 'center'
  },

})