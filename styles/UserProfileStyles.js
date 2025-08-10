import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
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
  logo: {
    width: 140,
    height: 40,
    resizeMode: 'contain',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySquare: {
    width: 120,
    height: 120,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'cover',
  },
  followContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: width * 0.65,
    position: 'absolute',
    top: height * 0.21,
  },
  followItem: {
    alignItems: 'center',
    width: width * 0.28,
  },
  followNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 0,
  },
  followText: {
    fontSize: 14,
    color: '#333',
    marginTop: 0,
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
    marginBottom: 5,
  },
  profileBio: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginTop: 25,
    marginBottom: 15,
    alignSelf: 'center',
  },
  createPostContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: height * 0.02,
  },
  createPostText: {
    fontSize: height * 0.018,
    color: '#777',
    fontWeight: '600',
  },
  actionRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  marginTop: 10,
  gap: 10, // Or use marginRight if gap not supported
},

chatButton: {
  width: 35,
  height: 35,
  marginLeft: 12,
  marginTop: 10, 
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#D1D5DB",      // ✅ Black border
  backgroundColor: "#fff",  // ✅ White background
  overflow: "hidden",
  alignItems: "center",
  justifyContent: "center",
},


chatIcon: {
  width: 18,
  height: 18,
},
});

export default styles;
