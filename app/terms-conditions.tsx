import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Mail, Phone } from 'lucide-react-native';

export default function TermsConditionsScreen() {
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
        <Text style={styles.headerTitle}>Terms and Conditions</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last Updated: December 1, 2025</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.paragraph}>
            Welcome to NDIZIFLIX. These Terms and Conditions (&quot;Terms&quot;) constitute a legally 
            binding agreement between you and NDIZIFLIX ENTERTAINMENT LTD (&quot;Company,&quot; &quot;we,&quot; 
            &quot;us,&quot; or &quot;our&quot;) governing your access to and use of our streaming platform, 
            website, mobile applications, and related services (collectively, the &quot;Service&quot;).
          </Text>
          <Text style={styles.paragraph}>
            By accessing or using NDIZIFLIX, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms. If you do not agree to these Terms, you 
            must not access or use the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Eligibility and Account Registration</Text>
          
          <Text style={styles.subsectionTitle}>2.1 Age Requirements</Text>
          <Text style={styles.paragraph}>
            You must be at least 18 years old to create an account and use our Service. 
            If you are between 13 and 18 years old, you may use the Service only with 
            parental or guardian consent and supervision.
          </Text>

          <Text style={styles.subsectionTitle}>2.2 Account Creation</Text>
          <Text style={styles.paragraph}>
            To access certain features, you must create an account by providing accurate, 
            current, and complete information. You are responsible for:{'\n\n'}
            • Maintaining the confidentiality of your account credentials{'\n'}
            • All activities that occur under your account{'\n'}
            • Notifying us immediately of any unauthorized use{'\n'}
            • Ensuring your account information remains accurate and up-to-date
          </Text>

          <Text style={styles.subsectionTitle}>2.3 Account Restrictions</Text>
          <Text style={styles.paragraph}>
            You may not:{'\n'}
            • Create multiple accounts for fraudulent purposes{'\n'}
            • Share your account with others outside your household{'\n'}
            • Transfer or sell your account to another person{'\n'}
            • Use another person&apos;s account without permission
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Subscription and Payment</Text>
          
          <Text style={styles.subsectionTitle}>3.1 Subscription Plans</Text>
          <Text style={styles.paragraph}>
            NDIZIFLIX offers various subscription plans with different features and pricing. 
            By subscribing, you authorize us to charge your payment method on a recurring 
            basis according to your selected plan.
          </Text>

          <Text style={styles.subsectionTitle}>3.2 Billing and Renewal</Text>
          <Text style={styles.paragraph}>
            • Subscriptions automatically renew at the end of each billing period{'\n'}
            • You will be charged at the then-current rate unless you cancel{'\n'}
            • Subscription fees are non-refundable except as required by law{'\n'}
            • We reserve the right to change pricing with 30 days&apos; notice
          </Text>

          <Text style={styles.subsectionTitle}>3.3 Payment Methods</Text>
          <Text style={styles.paragraph}>
            You must provide a valid payment method to maintain an active subscription. 
            You authorize us to charge all fees to your designated payment method and to 
            update payment information as necessary.
          </Text>

          <Text style={styles.subsectionTitle}>3.4 Free Trials</Text>
          <Text style={styles.paragraph}>
            Free trial offers are available to new subscribers only and limited to one per 
            user. We may charge your payment method when the trial ends unless you cancel 
            before the trial period expires.
          </Text>

          <Text style={styles.subsectionTitle}>3.5 Cancellation</Text>
          <Text style={styles.paragraph}>
            You may cancel your subscription at any time. Cancellation takes effect at the 
            end of your current billing period. You will retain access to the Service until 
            that date. No refunds or credits will be provided for partial billing periods.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Content and Intellectual Property</Text>
          
          <Text style={styles.subsectionTitle}>4.1 License to Use</Text>
          <Text style={styles.paragraph}>
            Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, 
            revocable license to access and view content available on NDIZIFLIX for your 
            personal, non-commercial use only.
          </Text>

          <Text style={styles.subsectionTitle}>4.2 Ownership</Text>
          <Text style={styles.paragraph}>
            All content, features, and functionality on NDIZIFLIX, including but not limited 
            to text, graphics, logos, images, videos, audio clips, software, and compilation, 
            are owned by NDIZIFLIX ENTERTAINMENT LTD or our content providers and are 
            protected by international copyright, trademark, and other intellectual property laws.
          </Text>

          <Text style={styles.subsectionTitle}>4.3 Restrictions</Text>
          <Text style={styles.paragraph}>
            You may not:{'\n\n'}
            • Copy, reproduce, distribute, or publicly display content{'\n'}
            • Modify, adapt, translate, or create derivative works{'\n'}
            • Download content except where explicitly permitted{'\n'}
            • Remove copyright or other proprietary notices{'\n'}
            • Use automated systems to access or scrape content{'\n'}
            • Circumvent technological protection measures{'\n'}
            • Share or redistribute content outside the platform
          </Text>

          <Text style={styles.subsectionTitle}>4.4 User-Generated Content</Text>
          <Text style={styles.paragraph}>
            If you submit reviews, ratings, or other content, you grant us a worldwide, 
            perpetual, royalty-free license to use, reproduce, modify, and display such 
            content in connection with the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Acceptable Use Policy</Text>
          <Text style={styles.paragraph}>
            You agree not to use the Service to:{'\n\n'}
            • Violate any applicable laws or regulations{'\n'}
            • Infringe on the rights of others{'\n'}
            • Upload or transmit viruses, malware, or harmful code{'\n'}
            • Interfere with the proper functioning of the Service{'\n'}
            • Attempt to gain unauthorized access to systems or accounts{'\n'}
            • Harass, threaten, or harm other users{'\n'}
            • Impersonate any person or entity{'\n'}
            • Collect user information without consent{'\n'}
            • Use the Service for commercial purposes without authorization
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Content Availability and Quality</Text>
          <Text style={styles.paragraph}>
            • Content availability varies by region and may change without notice{'\n'}
            • We do not guarantee continuous, uninterrupted access to all content{'\n'}
            • Streaming quality depends on your internet connection and device{'\n'}
            • We reserve the right to add, modify, or remove content at any time{'\n'}
            • Certain content may have viewing restrictions or expiration dates
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Service Modifications and Interruptions</Text>
          <Text style={styles.paragraph}>
            We reserve the right to:{'\n\n'}
            • Modify, suspend, or discontinue the Service at any time{'\n'}
            • Change features, functionality, or content offerings{'\n'}
            • Perform scheduled or emergency maintenance{'\n'}
            • Update system requirements and technical specifications
          </Text>
          <Text style={styles.paragraph}>
            We are not liable for any interruptions, delays, or modifications to the Service, 
            whether scheduled or unscheduled.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Territorial Restrictions</Text>
          <Text style={styles.paragraph}>
            Content available on NDIZIFLIX may be subject to geographic restrictions based 
            on licensing agreements. You may only access content while located in territories 
            where we have the legal right to offer such content. Using VPNs or other methods 
            to circumvent territorial restrictions is prohibited.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Third-Party Links and Services</Text>
          <Text style={styles.paragraph}>
            Our Service may contain links to third-party websites, services, or content. 
            We are not responsible for the availability, accuracy, or content of such 
            third-party resources. Your use of third-party services is governed by their 
            respective terms and policies.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Disclaimers and Limitations of Liability</Text>
          
          <Text style={styles.subsectionTitle}>10.1 Disclaimer of Warranties</Text>
          <Text style={styles.paragraph}>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY 
            KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
            OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </Text>
          <Text style={styles.paragraph}>
            We do not warrant that:{'\n'}
            • The Service will be uninterrupted, timely, secure, or error-free{'\n'}
            • Content will meet your expectations or requirements{'\n'}
            • Defects or errors will be corrected{'\n'}
            • The Service is free from viruses or harmful components
          </Text>

          <Text style={styles.subsectionTitle}>10.2 Limitation of Liability</Text>
          <Text style={styles.paragraph}>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, NDIZIFLIX ENTERTAINMENT LTD SHALL NOT 
            BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE 
            DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR OTHER 
            INTANGIBLE LOSSES, ARISING FROM YOUR USE OF THE SERVICE.
          </Text>
          <Text style={styles.paragraph}>
            Our total liability to you for all claims arising from or related to the Service 
            shall not exceed the amount you paid to us in the 12 months preceding the claim.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Indemnification</Text>
          <Text style={styles.paragraph}>
            You agree to indemnify, defend, and hold harmless NDIZIFLIX ENTERTAINMENT LTD, 
            its officers, directors, employees, and agents from any claims, liabilities, 
            damages, losses, and expenses (including reasonable attorney fees) arising from:{'\n\n'}
            • Your violation of these Terms{'\n'}
            • Your use or misuse of the Service{'\n'}
            • Your violation of any rights of another party{'\n'}
            • Any content you submit or share through the Service
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Account Termination</Text>
          <Text style={styles.paragraph}>
            We reserve the right to suspend or terminate your account and access to the 
            Service at our sole discretion, without notice or liability, for any reason, 
            including but not limited to:{'\n\n'}
            • Violation of these Terms{'\n'}
            • Fraudulent or illegal activity{'\n'}
            • Non-payment of subscription fees{'\n'}
            • Abusive or harmful behavior{'\n'}
            • Prolonged inactivity
          </Text>
          <Text style={styles.paragraph}>
            Upon termination, your right to use the Service ceases immediately. You may 
            voluntarily terminate your account through account settings or by contacting 
            customer support.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Dispute Resolution</Text>
          
          <Text style={styles.subsectionTitle}>13.1 Governing Law</Text>
          <Text style={styles.paragraph}>
            These Terms are governed by and construed in accordance with the laws of Kenya, 
            without regard to its conflict of law provisions.
          </Text>

          <Text style={styles.subsectionTitle}>13.2 Dispute Resolution Process</Text>
          <Text style={styles.paragraph}>
            Before initiating formal legal proceedings, you agree to attempt to resolve 
            disputes through informal negotiation by contacting us at ndiziflix@gmail.com. 
            We will make reasonable efforts to resolve disputes within 30 days.
          </Text>

          <Text style={styles.subsectionTitle}>13.3 Jurisdiction</Text>
          <Text style={styles.paragraph}>
            Any legal action or proceeding arising from these Terms shall be brought 
            exclusively in the courts located in Nairobi, Kenya. You consent to the 
            personal jurisdiction of such courts.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. General Provisions</Text>
          
          <Text style={styles.subsectionTitle}>14.1 Entire Agreement</Text>
          <Text style={styles.paragraph}>
            These Terms, together with our Privacy Policy, constitute the entire agreement 
            between you and NDIZIFLIX ENTERTAINMENT LTD regarding the Service.
          </Text>

          <Text style={styles.subsectionTitle}>14.2 Severability</Text>
          <Text style={styles.paragraph}>
            If any provision of these Terms is found to be unenforceable or invalid, that 
            provision shall be limited or eliminated to the minimum extent necessary, and 
            the remaining provisions shall remain in full force and effect.
          </Text>

          <Text style={styles.subsectionTitle}>14.3 Waiver</Text>
          <Text style={styles.paragraph}>
            Our failure to enforce any right or provision of these Terms shall not 
            constitute a waiver of such right or provision.
          </Text>

          <Text style={styles.subsectionTitle}>14.4 Assignment</Text>
          <Text style={styles.paragraph}>
            You may not assign or transfer these Terms or your account without our prior 
            written consent. We may assign these Terms without restriction.
          </Text>

          <Text style={styles.subsectionTitle}>14.5 Force Majeure</Text>
          <Text style={styles.paragraph}>
            We shall not be liable for any failure or delay in performance due to 
            circumstances beyond our reasonable control, including acts of God, natural 
            disasters, war, terrorism, or internet service provider failures.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>15. Changes to Terms</Text>
          <Text style={styles.paragraph}>
            We reserve the right to modify these Terms at any time. Material changes will 
            be notified through:{'\n\n'}
            • Email notification to your registered address{'\n'}
            • In-app notification upon your next login{'\n'}
            • Prominent notice on our website
          </Text>
          <Text style={styles.paragraph}>
            Changes take effect 30 days after notification unless otherwise stated. 
            Continued use of the Service after changes become effective constitutes your 
            acceptance of the modified Terms. If you do not agree to the changes, you must 
            discontinue use of the Service.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>16. Contact Information</Text>
          <Text style={styles.paragraph}>
            For questions, concerns, or support regarding these Terms or the Service, 
            please contact us:
          </Text>
          
          <View style={styles.contactInfo}>
            <Text style={styles.companyName}>NDIZIFLIX ENTERTAINMENT LTD</Text>
            <Text style={styles.contactDetail}>Twin Towers Plaza, 4th Floor</Text>
            <Text style={styles.contactDetail}>Nairobi, Kenya</Text>
            
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
            Our customer support team is available Monday through Friday, 9:00 AM to 6:00 PM 
            East Africa Time (EAT). We strive to respond to all inquiries within 24-48 hours.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>17. Acknowledgment</Text>
          <Text style={styles.paragraph}>
            BY USING NDIZIFLIX, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND 
            CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT 
            AGREE TO THESE TERMS, YOU MUST NOT ACCESS OR USE THE SERVICE.
          </Text>
        </View>

        <Text style={styles.footer}>
          Thank you for choosing NDIZIFLIX. We hope you enjoy our entertainment streaming service!
        </Text>
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
    marginBottom: 8,
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
  footer: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 24,
    fontStyle: 'italic' as const,
  },
});
