import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    alignItems: 'center',
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
    marginTop: 15,
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 15,
  },
  label: {
    width: '50%',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    alignSelf: 'center',
  },
  mandatory: {
    color: 'red',
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

  // Updated dobContainer to match input width and alignment
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%', // Match input width
    marginBottom: 12,
    alignSelf: 'center', // Center like the input
  },
  
  // Updated pickerContainer to ensure equal widths
  pickerContainer: {
    width: '32%', // Slightly less than 1/3 to account for spacing
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  
  picker: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    backgroundColor: 'transparent',
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#333',
    outlineStyle: 'none',
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
  borderWidth: 0,                // 👈 Remove inner border
  backgroundColor: 'transparent', // 👈 Remove any background
  outlineStyle: 'none',           // 👈 Prevents focus outline on Web
},
  eyeIcon: {
    width: 20,
    height: 20,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  termsLink: {
    fontWeight: 'bold',
    color: '#007bff',
  },

  signUpButton: {
    backgroundColor: '#007bff',
    width: '50%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 10,
    alignSelf: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 30,
  },
  loginLink: {
    fontWeight: 'bold',
    color: '#007bff',
  },
});