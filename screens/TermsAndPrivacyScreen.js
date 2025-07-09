"use client"

import { useEffect } from "react"
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"

const TermsPrivacyScreen = ({ navigation }) => {
  // 🔥 AGGRESSIVE TITLE SETTING - Same as other screens
  useEffect(() => {
    const setTitle = () => {
      if (typeof document !== "undefined") {
        document.title = "Artizen"
      }
    }

    // Set immediately
    setTitle()

    // Set after a small delay to override anything else
    const timer1 = setTimeout(setTitle, 100)
    const timer2 = setTimeout(setTitle, 500)
    const timer3 = setTimeout(setTitle, 1000)

    // Set on focus (when user clicks on tab)
    const handleFocus = () => setTitle()
    window.addEventListener?.("focus", handleFocus)

    // Cleanup
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      window.removeEventListener?.("focus", handleFocus)
    }
  }, [])

  // 🔄 Also set title whenever component re-renders
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.title = "Artizen"
    }
  })

  // Simple CSS fix - only target body/html, not components
  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      const existingStyle = document.getElementById("force-scroll-style")
      if (existingStyle) {
        existingStyle.remove()
      }

      const style = document.createElement("style")
      style.id = "force-scroll-style"
      style.textContent = `
        /* Only fix scrolling and body background - don't touch components */
        html, body {
          height: 100% !important;
          overflow: auto !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: white !important;
        }
        #root, #main, .expo-web-container {
          height: 100% !important;
          overflow: auto !important;
          background-color: white !important;
        }
        /* Only fix scroll containers */
        div[data-focusable="true"],
        .rn-scrollview {
          overflow: auto !important;
          -webkit-overflow-scrolling: touch !important;
        }
      `
      document.head.appendChild(style)
      console.log("Terms screen CSS scroll fix applied!")
    }
  }, [])

  return (
    <View style={styles.container}>
      {/* ✅ Header Section (DO NOT TOUCH) - EXACT ORIGINAL */}
      <View style={styles.header}>
        {/* 🔙 Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("SignUpScreen")}>
          <Image source={require("../assets/icn_arrow_back.png")} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>

        {/* 🏷️ Logo */}
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo_artizen.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* ✅ SCROLLABLE CONTENT */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <View style={styles.content}>
          {/* Title Section */}
          <Text style={styles.title}>Artizen – Terms of Service, Privacy Policy & Community Guidelines</Text>
          <Text style={styles.effectiveDate}>Effective Date: 8th July 2025</Text>

          {/* Welcome Text */}
          <Text style={styles.welcomeText}>
            Welcome to Artizen, a creative platform for writers and thinkers to share original works and connect through
            storytelling. This document outlines the Terms of Service ("Terms"), Privacy Policy, and Community
            Guidelines that govern your use of Artizen. By using our platform, you agree to all of the following.
          </Text>

          {/* Section 1: Terms of Service */}
          <Text style={styles.sectionTitle}>1. Terms of Service</Text>

          <Text style={styles.subsectionTitle}>1.1. Eligibility</Text>
          <Text style={styles.bodyText}>
            To use Artizen, you must be at least 13 years old or the minimum age of digital consent in your
            jurisdiction. By registering, you confirm you meet this requirement.
          </Text>

          <Text style={styles.subsectionTitle}>1.2. Account Responsibility</Text>
          <Text style={styles.bodyText}>
            You are responsible for your account and for keeping your login credentials secure. Artizen is not
            responsible for any loss or damage resulting from unauthorized access to your account.
          </Text>

          <Text style={styles.subsectionTitle}>1.3. Platform Access and Changes</Text>
          <Text style={styles.bodyText}>
            We may update, modify, or suspend the platform or its features at any time, with or without notice.
            Continued use of the platform after changes are made constitutes acceptance of the revised terms.
          </Text>

          {/* Section 2: User Conduct */}
          <Text style={styles.sectionTitle}>2. User Conduct</Text>
          <Text style={styles.bodyText}>By using Artizen, you agree not to:</Text>
          <Text style={styles.bulletPoint}>
            • Post content that is illegal, defamatory, harmful, hateful, or abusive
          </Text>
          <Text style={styles.bulletPoint}>• Engage in harassment, impersonation, or deceptive behavior</Text>
          <Text style={styles.bulletPoint}>
            • Violate intellectual property rights (plagiarism, unlicensed use, etc.)
          </Text>
          <Text style={styles.bulletPoint}>• Spread spam, malicious software, or disruptive content</Text>
          <Text style={styles.bulletPoint}>• Use Artizen for commercial solicitations without permission</Text>
          <Text style={styles.bodyText}>
            Violating these rules may lead to content removal, suspension, or permanent termination of your account.
          </Text>

          {/* Section 3: Content Ownership & Licensing */}
          <Text style={styles.sectionTitle}>3. Content Ownership & Licensing</Text>

          <Text style={styles.subsectionTitle}>3.1. Your Content</Text>
          <Text style={styles.bodyText}>
            You retain full ownership of any original content you create and publish on Artizen.
          </Text>

          <Text style={styles.subsectionTitle}>3.2. License to Artizen</Text>
          <Text style={styles.bodyText}>
            By posting on Artizen, you grant us a non-exclusive, royalty-free, worldwide license to use, display,
            distribute, and promote your content on our platform and through promotional channels (e.g., social media,
            newsletters). You can remove your content at any time.
          </Text>

          {/* Section 4: Community Guidelines */}
          <Text style={styles.sectionTitle}>4. Community Guidelines</Text>
          <Text style={styles.bodyText}>
            Artizen is a respectful space for diverse voices. By participating, you agree to:
          </Text>
          <Text style={styles.bulletPoint}>• Only post original content or works you have the rights to share</Text>
          <Text style={styles.bulletPoint}>• Respect the rights and identities of others</Text>
          <Text style={styles.bulletPoint}>• Avoid hate speech, graphic violence, and harassment</Text>
          <Text style={styles.bulletPoint}>• Provide constructive feedback in discussions and comments</Text>
          <Text style={styles.bulletPoint}>• Use content or trigger warnings when necessary</Text>
          <Text style={styles.bodyText}>
            We reserve the right to remove any content or account that violates these principles.
          </Text>

          {/* Section 5: Moderation & Reporting */}
          <Text style={styles.sectionTitle}>5. Moderation & Reporting</Text>
          <Text style={styles.bodyText}>
            Artizen is moderated to maintain a safe and respectful environment. We may remove content or restrict users
            at our discretion. If you encounter content that violates these terms, report it or email
            contact@artizen.world.
          </Text>

          {/* Section 6: Privacy Policy */}
          <Text style={styles.sectionTitle}>6. Privacy Policy</Text>

          <Text style={styles.subsectionTitle}>6.1. What We Collect</Text>
          <Text style={styles.bodyText}>When you use Artizen, we may collect:</Text>
          <Text style={styles.bulletPoint}>• Name (real or display name)</Text>
          <Text style={styles.bulletPoint}>• Email address</Text>
          <Text style={styles.bulletPoint}>• User-generated posts and submissions</Text>
          <Text style={styles.bulletPoint}>• IP address</Text>
          <Text style={styles.bulletPoint}>• Browser/device metadata (for analytics and performance)</Text>
          <Text style={styles.bodyText}>
            We only collect the minimum data necessary to provide and improve our services.
          </Text>

          <Text style={styles.subsectionTitle}>6.2. How We Use Your Data</Text>
          <Text style={styles.bodyText}>Your data is used to:</Text>
          <Text style={styles.bulletPoint}>• Create and manage your account</Text>
          <Text style={styles.bulletPoint}>• Display and organize your content</Text>
          <Text style={styles.bulletPoint}>• Provide support and respond to your inquiries</Text>
          <Text style={styles.bulletPoint}>• Improve and secure the platform</Text>
          <Text style={styles.bulletPoint}>• Communicate important updates or changes</Text>

          <Text style={styles.subsectionTitle}>6.3. Data Sharing</Text>
          <Text style={styles.bodyText}>
            We do not sell, rent, or share your personal data with third parties. We may use trusted third-party service
            providers (e.g., hosting, analytics, or email services) who are bound by strict confidentiality and data
            protection terms.
          </Text>

          <Text style={styles.subsectionTitle}>6.4. Cookies & Tracking</Text>
          <Text style={styles.bodyText}>Artizen uses cookies and similar technologies to:</Text>
          <Text style={styles.bulletPoint}>• Keep you logged in</Text>
          <Text style={styles.bulletPoint}>• Store your preferences</Text>
          <Text style={styles.bulletPoint}>• Analyze traffic and user behavior</Text>
          <Text style={styles.bodyText}>
            You can disable cookies via your browser settings, though some features may be affected.
          </Text>

          <Text style={styles.subsectionTitle}>6.5. Data Access and Deletion</Text>
          <Text style={styles.bodyText}>You have the right to:</Text>
          <Text style={styles.bulletPoint}>• Access your personal data</Text>
          <Text style={styles.bulletPoint}>• Correct any inaccurate data</Text>
          <Text style={styles.bulletPoint}>• Delete your account and associated data</Text>
          <Text style={styles.bodyText}>
            To make a request, email contact@artizen.life. We comply with data protection laws including GDPR and CCPA
            (where applicable).
          </Text>

          {/* Section 7: Disclaimers & Limitation of Liability */}
          <Text style={styles.sectionTitle}>7. Disclaimers & Limitation of Liability</Text>
          <Text style={styles.bulletPoint}>• Artizen is provided "as is" without any warranties.</Text>
          <Text style={styles.bulletPoint}>
            • We are not responsible for user-generated content or third-party links.
          </Text>
          <Text style={styles.bulletPoint}>
            • We are not liable for any direct, indirect, or incidental damages arising from your use of the platform.
          </Text>

          {/* Section 8: Governing Law */}
          <Text style={styles.sectionTitle}>8. Governing Law</Text>
          <Text style={styles.bodyText}>
            These terms are governed by the laws of [Insert Country or State]. Any disputes arising from these terms
            shall be resolved in the courts of that jurisdiction.
          </Text>

          {/* Section 9: Changes to This Policy */}
          <Text style={styles.sectionTitle}>9. Changes to This Policy</Text>
          <Text style={styles.bodyText}>
            We may update this document from time to time. The "Effective Date" will reflect the most recent changes.
            Continued use of Artizen constitutes acceptance of the revised terms.
          </Text>

          {/* Section 10: Contact Us */}
          <Text style={styles.sectionTitle}>10. Contact Us</Text>
          <Text style={styles.bodyText}>For questions, support, or legal inquiries, reach out to:</Text>
          <Text style={styles.contactEmail}>📧 contact@artizen.life</Text>

          {/* Accept Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.navigate("SignUpScreen")}>
              <Text style={styles.acceptButtonText}>I Agree and Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  // ✅ Header (DO NOT CHANGE) - EXACT ORIGINAL
  header: {
    width: "100%",
    height: 70,
    backgroundColor: "#F7F7F7", // Gray header
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: "contain",
  },
  backButton: {
    position: "absolute",
    left: 15,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  // ✅ ScrollView
  scrollView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    paddingBottom: 50,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
    backgroundColor: "white",
  },
  // Content Styles
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 26,
  },
  effectiveDate: {
    fontSize: 14,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 5,
  },
  contact: {
    fontSize: 14,
    color: "#007bff",
    textAlign: "center",
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    marginBottom: 25,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
    marginTop: 20,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 10,
    marginTop: 15,
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6c757d",
    marginBottom: 12,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6c757d",
    marginBottom: 8,
    paddingLeft: 10,
  },
  contactEmail: {
    fontSize: 16,
    color: "#007bff",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 30,
    alignItems: "center",
    backgroundColor: "white",
  },
  acceptButton: {
    backgroundColor: "#007bff",
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  acceptButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default TermsPrivacyScreen
