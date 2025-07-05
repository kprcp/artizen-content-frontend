import { StyleSheet } from 'react-native';

const SettingsStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  backButton: {
    position: 'absolute',
    left: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backIcon: {
    width: 24,
    height: 24,
  },

  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },

  profileTextContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 30,
  },

  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },

  input: {
    width: '50%',
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  clickableInput: {
    backgroundColor: '#fff',
  },

  inputPressed: {
    backgroundColor: '#e6f0ff',
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  inputText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#333',
  },

  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 10,
  },

  switchBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  // ✅ New styles for logout
  logoutBox: {
    backgroundColor: '#fff',
    borderColor: '#ff3b30',
    borderWidth: 1,
    marginTop: 20,
  },

  logoutText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#ff3b30',
    textAlign: 'center',
    width: '100%',
  },

   deleteButton: {
    width: '25%',
    height: 45,
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 54,
  },

  deleteText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },

});


export default SettingsStyle;
