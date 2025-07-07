// PostPageStyles.js
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    zIndex: 10,
    elevation: 5,
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
  postContainer: {
    marginTop: 30,
    width: width * 0.9,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    alignItems: 'center',
  },
  profilePicSquare: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: -5,
    marginBottom: 10,
    textAlign: 'center',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  postContent: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  confirmationContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  liveText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  doneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});