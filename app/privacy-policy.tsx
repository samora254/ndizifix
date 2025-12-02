import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Phone } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:ndiziflix@gmail.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+254704646611');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: December 1, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Introduction</Text>
          <Text style={styles.paragraph}>
            Welcome to NDIZIFLIX. This Privacy Policy explains how NDIZIFLIX ENTERTAINMENT LTD 
            (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects your personal 
            information when you use our streaming platform and services.
          </Text>
          <Text style={styles.paragraph}>
            We are committed to protecting your privacy and ensuring the security of your 
            personal data. By using NDIZIFLIX, you consent to the data practices described 
            in this policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Information We Collect</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Information You Provide</Text>
          <Text style={styles.paragraph}>
            • Account Information: Name, email address, password, and phone number{'\n'}
            • Payment Information: Billing details and payment method information{'\n'}
            • Profile Information: Viewing preferences, watch history, and ratings{'\n'}
            • Communications: Messages you send to us and feedback you provide
          </Text>

          <Text style={styles.subsectionTitle}>2.2 Automatically Collected Information</Text>
          <Text style={styles.paragraph}>
            • Device Information: Device type, operating system, unique device identifiers{'\n'}
            • Usage Data: Content viewed, viewing duration, search queries, and interactions{'\n'}
            • Location Data: IP address and general geographic location{'\n'}
            • Technical Data: Browser type, time zone settings, and screen resolution
          </Text>

          <Text style={styles.subsectionTitle}>2.3 Cookies and Similar Technologies</Text>
          <Text style={styles.paragraph}>
            We use cookies, web beacons, and similar technologies to enhance your 
            experience, analyze usage patterns, and deliver personalized content. You can 
            manage cookie preferences through your browser settings.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the collected information for the following purposes:{'\n\n'}
            • Service Delivery: Provide and maintain our streaming services{'\n'}
            • Personalization: Recommend content based on your viewing history and preferences{'\n'}
            • Communication: Send updates, newsletters, and promotional materials{'\n'}
            • Account Management: Process registrations, manage subscriptions, and handle payments{'\n'}
            • Improvement: Analyze usage patterns to improve our services and user experience{'\n'}
            • Security: Detect and prevent fraud, unauthorized access, and illegal activities{'\n'}
            • Legal Compliance: Comply with legal obligations and protect our rights
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Information Sharing and Disclosure</Text>
          
          <Text style={styles.subsectionTitle}>4.1 Third-Party Service Providers</Text>
          <Text style={styles.paragraph}>
            We may share your information with trusted third-party service providers who 
            assist us in operating our platform, including:{'\n'}
            • Payment processors{'\n'}
            • Cloud storage providers{'\n'}
            • Analytics services{'\n'}
            • Customer support platforms{'\n'}
            • Content delivery networks
          </Text>

          <Text style={styles.subsectionTitle}>4.2 Legal Requirements</Text>
          <Text style={styles.paragraph}>
            We may disclose your information when required by law, court order, or 
            governmental authority, or to protect our rights, property, or safety.
          </Text>

          <Text style={styles.subsectionTitle}>4.3 Business Transfers</Text>
          <Text style={styles.paragraph}>
            In the event of a merger, acquisition, or sale of assets, your information 
            may be transferred to the acquiring entity.
          </Text>

          <Text style={styles.subsectionTitle}>4.4 Your Consent</Text>
          <Text style={styles.paragraph}>
            We may share your information with your explicit consent for specific purposes 
            not covered in this policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Data Security</Text>
          <Text style={styles.paragraph}>
            We implement industry-standard security measures to protect your personal 
            information from unauthorized access, alteration, disclosure, or destruction. 
            These measures include:{'\n\n'}
            • Encryption of data in transit and at rest{'\n'}
            • Regular security audits and assessments{'\n'}
            • Secure authentication mechanisms{'\n'}
            • Access controls and employee training{'\n'}
            • Incident response procedures
          </Text>
          <Text style={styles.paragraph}>
            However, no method of transmission over the internet is 100% secure. We 
            cannot guarantee absolute security of your information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain your personal information for as long as necessary to provide our 
            services and fulfill the purposes outlined in this policy. Account information 
            is retained while your account is active and for a reasonable period afterward 
            for legal and business purposes.
          </Text>
          <Text style={styles.paragraph}>
            Viewing history and preferences are retained to improve recommendations. You 
            can request deletion of your data as described in the &quot;Your Rights&quot; section.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Your Rights and Choices</Text>
          <Text style={styles.paragraph}>
            You have the following rights regarding your personal information:{'\n\n'}
            • Access: Request a copy of your personal data{'\n'}
            • Correction: Update or correct inaccurate information{'\n'}
            • Deletion: Request deletion of your account and associated data{'\n'}
            • Portability: Receive your data in a machine-readable format{'\n'}
            • Objection: Object to certain processing of your data{'\n'}
            • Restriction: Request limitation of data processing{'\n'}
            • Withdraw Consent: Opt-out of marketing communications at any time
          </Text>
          <Text style={styles.paragraph}>
            To exercise these rights, please contact us using the information provided below.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Children&apos;s Privacy</Text>
          <Text style={styles.paragraph}>
            NDIZIFLIX is not intended for children under the age of 13. We do not knowingly 
            collect personal information from children under 13. If we become aware that we 
            have collected information from a child under 13, we will take steps to delete 
            such information promptly.
          </Text>
          <Text style={styles.paragraph}>
            Parents and guardians are encouraged to monitor their children&apos;s online 
            activities and use parental controls where available.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. International Data Transfers</Text>
          <Text style={styles.paragraph}>
            Your information may be transferred to and processed in countries other than 
            your country of residence. These countries may have different data protection 
            laws. We ensure appropriate safeguards are in place to protect your information 
            in accordance with this Privacy Policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Third-Party Links</Text>
          <Text style={styles.paragraph}>
            Our platform may contain links to third-party websites and services. We are 
            not responsible for the privacy practices of these external sites. We encourage 
            you to review their privacy policies before providing any personal information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Changes to This Policy</Text>
          <Text style={styles.paragraph}>
            We may update this Privacy Policy from time to time to reflect changes in our 
            practices or legal requirements. We will notify you of material changes by 
            posting the updated policy on our platform and updating the &quot;Last Updated&quot; date.
          </Text>
          <Text style={styles.paragraph}>
            Your continued use of NDIZIFLIX after changes are posted constitutes your 
            acceptance of the updated policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions, concerns, or requests regarding this Privacy Policy 
            or our data practices, please contact us:
          </Text>
          
          <View style={styles.contactInfo}>
            <Text style={styles.companyName}>NDIZIFLIX ENTERTAINMENT LTD</Text>
            <Text style={styles.contactDetail}>Twin Towers Plaza, 4th Floor</Text>
            
            <TouchableOpacity onPress={handlePhonePress} style={styles.contactRow}>
              <Phone size={18} color="#22C55E" />
              <Text style={styles.contactLink}>+254 704 646 611</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={handleEmailPress} style={styles.contactRow}>
              <Mail size={18} color="#22C55E" />
              <Text style={styles.contactLink}>ndiziflix@gmail.com</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.paragraph}>
            For data deletion requests, please email us with the subject line &quot;Data 
            Deletion Request&quot; and include your account details. We will respond to your 
            request within 30 days.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Consent</Text>
          <Text style={styles.paragraph}>
            By using NDIZIFLIX, you acknowledge that you have read and understood this 
            Privacy Policy and consent to the collection, use, and disclosure of your 
            information as described herein.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    fontStyle: 'italic' as const,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#22C55E',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    color: '#CCCCCC',
    lineHeight: 24,
    marginBottom: 12,
  },
  contactInfo: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  companyName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contactDetail: {
    fontSize: 14,
    color: '#CCCCCC',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactLink: {
    fontSize: 15,
    color: '#22C55E',
    marginLeft: 12,
    fontWeight: '600' as const,
  },
});
