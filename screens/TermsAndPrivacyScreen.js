import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles/TermsPrivacyStyles';

const TermsPrivacyScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      
      {/* ✅ Header Section */}
      <View style={styles.header}>
        
        {/* 🔙 Back Button (Navigates to SignUpScreen) */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SignUpScreen')}>
          <Image source={require('../assets/icn_arrow_back.png')} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>

        {/* 🏷️ Logo (Centered in Header) */}
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo_artizen.png')} style={styles.logo} resizeMode="contain" />
        </View>

      </View>

      {/* ✅ Accept and Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.navigate('SignUpScreen')}>
          <Text style={styles.acceptButtonText}>Accept and Continue</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default TermsPrivacyScreen;