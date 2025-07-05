import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
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
    marginTop: 20,
  },

  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },

  label: {
    width: '50%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    alignSelf: 'center',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45,
    marginBottom: 12,
    alignSelf: 'center',
  },

  passwordInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#333',
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    outlineStyle: 'none',   // ✅ prevents blue outline (React Native Web)
    outlineWidth: 0,   
  },

  eyeIcon: {
    width: 20,
    height: 20,
  },

  updateButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    alignSelf: 'center',
  },

  updateButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },

  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default styles;
