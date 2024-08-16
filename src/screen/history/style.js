import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({

  container: {
    backgroundColor: '#fff',
    flex: 1,
  },

  main_text: {
    fontFamily: 'RobotoBold',
    textAlign: 'center',
    fontSize: 30,
    marginTop: 30,
    marginBottom: 30
  },

  level_container: {
    marginTop: 40,
    marginLeft: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#5E60CE',
    borderRadius: 15
  },

  level_containered: {
    marginTop: 40,
    marginLeft: 10,
    marginHorizontal: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#A00000',
    borderRadius: 15
  },

  level: {
    fontFamily: 'RobotoRegular',
    fontSize: 20,
    marginBottom: 10,
    color: '#000',
    textAlign: "center"
  },

  score: {
    fontFamily: 'RobotoRegular',
    fontSize: 18,
    marginBottom: 10,
    color: "#66cc91"
  },

  back: {
    position: 'relative',
    top: "4%",
    left: "5%",
    color: '#000',
  },

  flatList: {
    position: 'relative',
    marginBottom: "40%"
  },

  score_container: {
    flexDirection: "row",
    justifyContent: "space-between"
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

  historyBtnWrapper: {
    backgroundColor: '#000',
    position: 'absolute',
    bottom: "2%",
    left: "5%",
    borderRadius: 30,
    zIndex: 2,
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

  no_data_text: {
    fontFamily: 'RobotoBold',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 30,
    marginBottom: 30,
  },

  picker: {
    fontFamily: 'RobotoRegular',
    borderColor: '#5E60CE',
    borderWidth: 1,
    fontSize: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 20,
    marginHorizontal: 15,
    color: '#000',
  },

})