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
    marginTop: 20
  },

  createButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#000",
    fontSize: 20,
  },



  
});