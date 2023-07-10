import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
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
    fontSize: 30,
    textAlign: 'center',
  },

  add_btn_container: {
    marginTop: 70,
    marginHorizontal: 15
  },

  add_btn:{
    fontSize: 20,
    backgroundColor: '#6930c3',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#6930c3',
    textAlign: 'center'
  },

  start_btn_container: {
    marginTop: 30,
    marginHorizontal: 15,
    marginBottom: 70
  },

  start_btn:{
    fontSize: 20,
    backgroundColor: '#6930c3',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#6930c3',
    textAlign: 'center',
  }

})