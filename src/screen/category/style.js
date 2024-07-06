import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    flex: 1
  },

  main_text: {
    fontFamily: 'RobotoBold',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 30
  },

  flatList: {
    position: 'relative',
    marginBottom: "40%"
  },

  level_container: {
    marginTop: 30,
    marginLeft: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#5E60CE',
    borderRadius: 15,
  },

  title: {
    fontFamily: 'RobotoRegular',
    fontSize: 25,
    marginBottom: 10,
    color: '#ffff'
  },

  name: {
    fontFamily: 'RobotoRegular',
    fontSize: 18,
    marginBottom: 5,
    color: "#66cc91"
  },

  back: {
    position: 'relative',
    top: "4%",
    left: "5%",
    color: '#000',
    zIndex: 2
  },

  welcome: {
    position: 'relative',
    top: "1%",
    textAlign: "right",
    color: '#5E60CE',
    fontFamily: 'RobotoBold',
    fontSize: 17,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3F4',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
    marginTop: "1%"
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
    bottom: "2%",
    right: "5%",
    borderRadius: 30,
    zIndex: 2,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

})