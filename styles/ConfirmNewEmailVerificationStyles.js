// styles/ConfirmNewEmailVerificationStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },

  backButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
  },

  backIcon: {
    width: 24,
    height: 24,
  },

  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#F7F7F7',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },

  logo: {
    width: 120,
    height: 40,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },

  label: {
    width: '50%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    alignSelf: 'center',
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
  },

  button: {
    backgroundColor: '#007bff',
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default styles;
