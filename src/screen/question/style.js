import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3F4',
    borderRadius: 10,
    marginVertical: 10,
    paddingHorizontal: 10,
    marginTop: "10%"
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  categoryItem: {
    flex: 1,
    marginTop: 10,
    marginBottom: 50,
  },
  categoryTitle: {
    color: '#333',
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    textAlign: 'center',
    paddingVertical: 10,
    borderRadius: 5,
  },
  itemWrapper: {
    marginVertical: 10,
    backgroundColor: '#F5F3F4',
    borderRadius: 10,
  },
  createBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 30,
  },
  createButton: {
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtn: {
    color: '#fff',
  },
  back: {
    position: 'absolute',
    top: "8%",
    left: "5%",
    flexDirection: "row",
  },
  icon_logo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
  },
  logo_container: {
    marginLeft: "51%",
    marginTop: 8,
  },
  profile_icon_logo: {
    width: 40,
    height: 40,
    borderRadius: 50,
    overflow: 'hidden',
  },
  icon_text: {
    fontFamily: 'RobotoBold',
    fontSize: 23,
    marginTop: 5,
    marginLeft: 10,
  },
  text: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  noCategoryText: {
    fontFamily: 'RobotoBold',
    fontSize: 20,
    textAlign: 'center',
    marginTop: 50,
  },
  sortBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 30,
    left: 30,
    borderRadius: 30,
  },
  sortButton: {
    backgroundColor: '#000',
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});