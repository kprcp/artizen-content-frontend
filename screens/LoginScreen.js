import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts1/AuthContext';
import { styles } from '../styles/LoginStyles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { setUser, loading: authLoading } = useAuth(); // ✅ Added authLoading

  const isValidEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleLogin = async () => {
    setLoginError('');
    
    if (!email || !password) {
      setLoginError('⚠️ Please fill in all fields.');
      return;
    }
    
    if (!isValidEmail(email)) {
      setLoginError('⚠️ Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    try {
      // ✅ UPDATED: Use your custom domain
      const response = await fetch('https://api.artizen.world/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Logged in:", data);
        console.log("👤 Received user object:", data.user);
        setLoginError('');
        setUser(data.user); // ✅ This will now trigger persistent storage
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainApp' }],
        });
      } else {
        setLoginError(`⚠️ ${data.error || 'Invalid credentials'}`);
      }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setLoginError('⚠️ Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SignUpScreen')}>
        <Image source={require('../assets/icn_arrow_back.png')} style={styles.backIcon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/logo_artizen.png')} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Log in to <Text style={{ color: '#007bff' }}>Artizen</Text></Text>
      <Text style={styles.subTitle}>Welcome back! Please enter your details</Text>

      {loginError !== '' && (
        <Text style={{ color: 'red', marginBottom: 10 }}>{loginError}</Text>
      )}

      <Text style={styles.label}>Email</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Enter Email" 
        value={email} 
        onChangeText={setEmail} 
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput} 
          placeholder="Enter Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry={!showPassword} 
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.loginButton} 
        onPress={handleLogin} 
        disabled={loading || authLoading} // ✅ Updated
      >
        <Text style={styles.loginButtonText}>
          {loading ? 'Logging in...' : 'Log In'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.signUpText}>
        Don't have an account?{' '}
        <Text style={styles.signUpLink} onPress={() => navigation.navigate('SignUpScreen')}>
          Sign up
        </Text>
      </Text>

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>
        <Text style={styles.forgotPassword}>Forgot your password?</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;