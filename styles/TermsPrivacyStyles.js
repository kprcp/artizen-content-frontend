import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window'); // ✅ Responsive screen dimensions

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between', // ✅ Ensures content is spaced properly
  },

  // ✅ Header (Fixed & Responsive)
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

  logo: {
    width: 140, 
    height: 40,
    resizeMode: 'contain',
  },

  backButton: {
    position: 'absolute',
    left: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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

  // ✅ Button Container (Fixes it at Bottom)
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: height * 0.05, // ✅ Responsive placement above bottom
    alignItems: 'center',
  },

  acceptButton: {
    backgroundColor: '#007bff', // ✅ Same blue as other buttons
    width: '90%', // ✅ Slight padding from edges
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8, // ✅ Rounded corners
  },

  acceptButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});