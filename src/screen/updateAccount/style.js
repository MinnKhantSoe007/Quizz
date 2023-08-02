import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: 'center'
  },

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
  },

  text: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: "#5E60CE",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    fontFamily: 'RobotoRegular',
  },

  createButton: {
    backgroundColor: "#5E60CE",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },

  createButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#000",
    fontSize: 20,
  },

  selectedPic: {
    width: 100,
    height: 100,
    marginTop: 20,
    borderRadius: 10,
    alignSelf: 'center'
  },

  photoButton: {
    backgroundColor: "#5E60CE",
    width: 100,
    height: 100,
    marginTop: 30,
    borderRadius: 10,
    alignSelf: 'center'
  },

  photoButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#000",
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 20
  },



  
});