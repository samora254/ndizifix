import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react-native';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setIsLoading(true);
    setError('');
    console.log('[Auth] Sending reset link to:', email);
    
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'ndiziflix://reset-password',
      });

      if (resetError) {
        console.error('[Auth] Reset password error:', resetError);
        setError(resetError.message);
        Alert.alert('Error', resetError.message);
        return;
      }

      console.log('[Auth] Reset email sent successfully');
      setEmailSent(true);
    } catch (err) {
      console.error('[Auth] Unexpected error:', err);
      setError('An unexpected error occurred');
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignIn = () => {
    router.back();
  };

  if (emailSent) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.successContainer}>
          <CheckCircle size={80} color="#22C55E" />
          <Text style={styles.successTitle}>Check Your Email</Text>
          <Text style={styles.successMessage}>
            We&apos;ve sent a password reset link to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>
          <Text style={styles.successSubtext}>
            Please check your inbox and follow the instructions to reset your password.
          </Text>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToSignIn}
          >
            <LinearGradient
              colors={['#22C55E', '#16A34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.backGradient}
            >
              <Text style={styles.backButtonText}>Back to Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backIconButton}
            onPress={handleBackToSignIn}
          >
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we&apos;ll send you a link to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Mail size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#666"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.resetGradient}
              >
                <Text style={styles.resetButtonText}>
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  backIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 56,
    color: '#FFFFFF',
    fontSize: 16,
  },
  resetButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  resetGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    color: '#22C55E',
    fontWeight: '600' as const,
  },
  successSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 40,
  },
  backButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  backGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  errorContainer: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center' as const,
  },
});
