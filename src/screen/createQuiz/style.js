import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },

  label: {
    fontFamily: 'RobotoRegular',
    fontSize: 18,
    marginBottom: 10,
  },

  Radiolabel: {
    fontFamily: 'RobotoRegular',
    fontSize: 18,
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
    marginTop: 30
  },

  createButtonText: {
    fontFamily: 'RobotoRegular',
    color: "#000",
    fontSize: 20,
  },

  back: {
    position: 'relative',
    // top: "4%",
    // left: "5%",
    color: '#000',
  },

  inputs: {
    marginTop: 30
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

  ok: {
    fontFamily: 'RobotoRegular',
    color: '#E5383B',
    fontSize: 20,
    marginTop: 10
  },

  no: {
    fontFamily: 'RobotoRegular',
    color: '#5E60CE',
    fontSize: 20,
    marginTop: 10
  },

});