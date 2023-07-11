import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  quiz_container: {
    marginHorizontal: 10,
    marginVertical: 30,
  },
  
  number: {
    color: 'grey',
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    marginTop: 10,
  },

  question: {
    textAlign: 'center',
    fontSize: 25,
    marginHorizontal: 25,
    letterSpacing: 2,
  },

  flatList: {
    position: 'relative',
    marginTop: 35,
  },

  answer_container: {
    marginTop: 30,
    paddingHorizontal: 10,
    backgroundColor: '#5E60CE',
    borderRadius: 10,
  },

  answer: {
    fontSize: 30,
    color: '#ffff',
    textAlignVertical: 'center',
  },

  continue_btn_container: {
    marginTop: 130
  },

  continue_btn:{
    fontSize: 20,
    backgroundColor: '#5E60CE',
    paddingVertical: 13,
    borderRadius: 10,
    textAlign: 'center',
  },

  continue_arrow: {
    color: '#000',
    left: 300,
    bottom: 43,
    position: 'relative',
  }

})