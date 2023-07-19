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
    marginTop: 100,
    marginBottom: 30
  },

  flatList: {
    position: 'relative',
    marginBottom: 200
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

  level: {
    fontFamily: 'RobotoRegular',
    fontSize: 30,
    marginBottom: 10,
    color: '#ffff'
  },

  back: {
    position: 'absolute',
    top: 30,
    left: 10,
    color: '#000',
  }

})