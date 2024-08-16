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
    marginLeft: "7%",
    marginRight: "14%"
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

  quizScore: {
    fontFamily: 'RobotoRegular',
    fontSize: 16,
  },

  back: {
    position: 'relative',
    top: "6%",
    // left: "5%",
    color: '#000',
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    top: "7.5%"
  },

  deleteBtn:{
    color:'#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3F4',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    marginTop: "2%"
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  sortBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    left: 30,
    borderRadius: 30,
  },
  sortButton: {
    backgroundColor: '#808080',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonText: {
    color: '#fff',
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

  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    fontFamily: 'RobotoBold',
  },
  modalOption: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#5E60CE',
    width: 100,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'RobotoBold',
  },
  noCategoryText: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  historyButton: {
    backgroundColor: '#088F8F',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyButtonText: {
    color: '#fff',
  },
  historyBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    alignSelf: "center",
    borderRadius: 30
  },

});