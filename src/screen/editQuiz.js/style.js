import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  label: {
    fontFamily: 'RobotoRegular',
    fontSize: 18,
    marginBottom: 10,
  },

  input: {
    borderWidth: 1,
    borderColor: "#5E60CE",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontFamily: 'RobotoRegular',
  },

  updateButton: {
    backgroundColor: '#5E60CE',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },

  updateButtonText: {
    color: '#000',
    fontFamily: 'RobotoRegular',
    fontSize: 20,
  },
  
  optionInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  deleteButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    backgroundColor: '#E5383B',
  },

  deleteButtonText: {
    color: "#000",
    fontFamily: 'RobotoRegular',
    fontSize: 20,
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

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
  },

  inputs: {
    marginTop: 50
  }
  

});