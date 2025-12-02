import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const { login } = useAppState();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');
    console.log('[Auth] Signing in with:', email);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (signInError) {
        console.error('[Auth] Sign in error:', signInError);
        setError(signInError.message);
        Alert.alert('Sign In Failed', signInError.message);
        return;
      }

      if (data.user) {
        console.log('[Auth] Sign in successful:', data.user.email);
        login();
        router.replace('/subscription');
      }
    } catch (err) {
      console.error('[Auth] Unexpected error:', err);
      setError('An unexpected error occurred');
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoNdizi}>NDIZI</Text>
              <Text style={styles.logoFlix}>FLIX</Text>
            </View>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>Welcome Back</Text>
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

            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#888" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  placeholderTextColor="#666"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#888" />
                  ) : (
                    <Eye size={20} color="#888" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Link href="/reset-password" asChild>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Link>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <LinearGradient
                colors={['#22C55E', '#16A34A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signInGradient}
              >
                <Text style={styles.signInButtonText}>
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don&apos;t have an account? </Text>
              <Link href="/sign-up" asChild>
                <TouchableOpacity>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
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
  backButton: {
    position: 'absolute' as const,
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  logoNdizi: {
    fontSize: 38,
    fontWeight: '800' as const,
    color: '#22C55E',
    letterSpacing: 2,
  },
  logoFlix: {
    fontSize: 38,
    fontWeight: '800' as const,
    color: '#EF4444',
    letterSpacing: 2,
  },
  underline: {
    width: 120,
    height: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 2,
    marginTop: 4,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginTop: 8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 20,
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
  eyeIcon: {
    padding: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#22C55E',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  signInGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  dividerText: {
    color: '#666',
    fontSize: 14,
    marginHorizontal: 16,
    fontWeight: '600' as const,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#888',
    fontSize: 16,
  },
  signUpLink: {
    color: '#22C55E',
    fontSize: 16,
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
