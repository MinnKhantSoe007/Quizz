import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },

  categoryTitle: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    marginBottom: 20,
    marginTop: 50,
    textAlign: 'center',
  },

  list: {
    marginBottom: 170,
  },

  quizItem: {
    marginBottom: 20,
    backgroundColor: '#F5F3F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10
  },

  quizQuestion: {
    fontSize: 16,
    fontFamily: 'RobotoRegular',
    marginBottom: 5,
  },

  quizLevel: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
  },

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
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

  createBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30
  },
  
  createButton: {
    backgroundColor: '#000',
    width:60,
    height:60,
    borderRadius:30,
    justifyContent:'center',
    alignItems:'center'
  },

  plusBtn:{
    color:'#fff',
  },

  deleteBtnWrapper: {
    backgroundColor: '#E5383B',
    position: 'absolute',
    right: 30,
    borderRadius: 30,
    top: 23
  },

  deleteBtn:{
    color:'#fff',
  },

});