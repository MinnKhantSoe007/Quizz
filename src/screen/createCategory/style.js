import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: 'center'

  },

  label: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#5E60CE",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontFamily: 'RobotoRegular',
  },

  createButton: {
    backgroundColor: "#5E60CE",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },

  createButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#fff",
    fontSize: 20,
  },

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
  }
});