import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  updateButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    paddingVertical: 10,
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
    marginTop: 30,
    marginBottom: 15,
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
  bigInput: {
    width: '50%',
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginBottom: 12,
    alignSelf: 'center',
    backgroundColor: '#fff',
    textAlignVertical: 'top',
  },

  // Date/Time selection styles - Commented out for MVP
  // dateTimeBox: {
  //   width: '50%',
  //   height: 45,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  //   borderRadius: 8,
  //   paddingHorizontal: 10,
  //   marginTop: 12,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   alignSelf: 'center',
  // },
  // nowText: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   color: '#333',
  // },
  // calendarIcon: {
  //   width: 22,
  //   height: 22,
  //   resizeMode: 'contain',
  // },
  // sectionTitle: {
  //   fontWeight: '600',
  //   fontSize: 16,
  // },
  // row: {
  //   flexDirection: 'row',
  //   gap: 8,
  //   alignItems: 'center',
  //   marginTop: 5,
  // },
  // select: {
  //   fontSize: 16,
  //   padding: 6,
  //   borderRadius: 4,
  //   borderColor: '#ccc',
  //   borderWidth: 1,
  // },
  // separator: {
  //   fontSize: 18,
  //   fontWeight: '600',
  //   paddingHorizontal: 4,
  // },
  // confirmButton: {
  //   marginTop: 20,
  //   padding: 10,
  //   backgroundColor: '#007AFF',
  //   color: '#fff',
  //   border: 'none',
  //   borderRadius: 6,
  //   fontSize: 16,
  //   fontWeight: '600',
  //   cursor: 'pointer',
  // },
});