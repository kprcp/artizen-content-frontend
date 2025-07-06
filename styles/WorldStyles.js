// WorldStyles.js
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

const WorldStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    //alignItems: 'center',
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
  feedContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  postContainer: {
    flexDirection: 'column',
    width: width * 0.9,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  moreIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
  },
  profilePicSquare: {
    width: 90,
    height: 90,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 6,
  },
  noProfileTextLine: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },
  fullName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
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
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginTop: 12,
    marginLeft: 10,
    marginBottom: 8,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  iconLabel: {
    fontSize: 14,
    color: '#555',
  },
});

export default WorldStyles;
