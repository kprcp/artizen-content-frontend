import { Picker } from '@react-native-picker/picker';
import { Head } from 'expo-head'; // ✅ Added expo-head import
import { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/SignUpStyles';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Keep the useEffect as backup
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'Artizen';
    }
  }, []);

  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 126 }, (_, i) => (new Date().getFullYear() - i).toString());
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

  const isValidEmail = (input) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !day || !month || !year || !password || !confirmPassword) {
      setErrorMessage("⚠️ All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("⚠️ Enter a valid Email address!");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match!");
      return;
    }

    const dob = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const hasBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    const userAge = hasBirthdayPassed ? age : age - 1;

    if (userAge < 18) {
      setErrorMessage("⚠️ You must be at least 18 years old to sign up.");
      return;
    }

    try {
      const response = await fetch('https://api.artizen.world/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email: email.trim().toLowerCase(),
          dob,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('VerificationScreen', { email, password });
      } else {
        setErrorMessage(`⚠️ ${data.error || 'Sign up failed'}`);
      }
    } catch (error) {
      setErrorMessage("⚠️ Network error. Please try again.");
    }
  };

  return (
    <>
      {/* ✅ Added Head component for persistent title */}
      <Head>
        <title>Artizen</title>
      </Head>
      
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../assets/logo_artizen.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Welcome to <Text style={{ color: '#007bff' }}>Artizen</Text></Text>
        <Text style={styles.subTitle}>Sign up to change your world</Text>

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <Text style={styles.label}>Full Name <Text style={styles.mandatory}>*</Text></Text>
        <TextInput style={styles.input} placeholder="Enter your Full Name" value={fullName} onChangeText={setFullName} />

        <Text style={styles.label}>Email Address <Text style={styles.mandatory}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Date of Birth <Text style={styles.mandatory}>*</Text></Text>
        <View style={styles.dobContainer}>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={month} onValueChange={setMonth} style={styles.picker}>
              <Picker.Item label="MM" value="" />
              {months.map((monthName, index) => (
                <Picker.Item key={index + 1} label={monthName} value={`${index + 1}`} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={day} onValueChange={setDay} style={styles.picker}>
              <Picker.Item label="DD" value="" />
              {days.map((d) => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Picker selectedValue={year} onValueChange={setYear} style={styles.picker}>
              <Picker.Item label="YYYY" value="" />
              {years.map((yr) => (
                <Picker.Item key={yr} label={yr} value={yr} />
              ))}
            </Picker>
          </View>
        </View>

        <Text style={styles.label}>Password <Text style={styles.mandatory}>*</Text></Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Create your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password <Text style={styles.mandatory}>*</Text></Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Image source={require('../assets/icn_show.png')} style={styles.eyeIcon} resizeMode="contain" />
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          By clicking Sign Up, you agree to our{' '}
          <TouchableOpacity onPress={() => navigation.navigate('TermsAndPrivacyScreen')}>
            <Text style={styles.termsLink}>Terms and Privacy Policy</Text>
          </TouchableOpacity>
        </Text>

        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.loginText}>
          Already have an account?
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLink}> Log in</Text>
          </TouchableOpacity>
        </Text>
      </SafeAreaView>
    </>
  );
};

export default SignUpScreen;