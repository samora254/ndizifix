import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Stack, useRouter } from 'expo-router';
import { Settings, Bell, HelpCircle, Shield, LogOut, ChevronLeft, LayoutDashboard } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, isLoggedIn, user } = useAppState();

  const isAdmin = user?.email === 'samorakibagendi254@gmail.com';

  const menuItems = [
    { icon: Settings, label: 'Settings', color: '#FF3B5C' },
    { icon: Bell, label: 'Notifications', color: '#3B82F6' },
    { icon: HelpCircle, label: 'Help & Support', color: '#10B981' },
    { icon: Shield, label: 'Privacy', color: '#F59E0B' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ChevronLeft size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {!isLoggedIn ? (
          <View style={styles.loggedOutSection}>
            <View style={styles.loggedOutIconContainer}>
              <Settings size={64} color="#666" />
            </View>
            <Text style={styles.loggedOutTitle}>Not Logged In</Text>
            <Text style={styles.loggedOutText}>
              Sign in to access your profile, personalize your experience, and unlock all features.
            </Text>
            <TouchableOpacity
              style={styles.signInPromptButton}
              onPress={() => router.push('/sign-in')}
              activeOpacity={0.7}
            >
              <Text style={styles.signInPromptButtonText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpPromptButton}
              onPress={() => router.push('/sign-up')}
              activeOpacity={0.7}
            >
              <Text style={styles.signUpPromptButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.initialsPlaceholder}>
                  <Text style={styles.initialsText}>
                    {(user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'U')
                      .split(' ')
                      .map((word: string) => word[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </Text>
                </View>
              </View>
              <Text style={styles.userName}>
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>

              {isAdmin && (
                <TouchableOpacity
                  style={styles.adminButton}
                  onPress={() => router.push('/admin-dashboard' as any)}
                  activeOpacity={0.7}
                >
                  <LayoutDashboard size={24} color="#FFFFFF" />
                  <Text style={styles.adminButtonText}>Admin Dashboard</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.menuSection}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}15` }]}>
                    <item.icon size={24} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.7}
              onPress={() => {
                console.log('[Auth] Logging out');
                logout();
                router.replace('/sign-in');
              }}
            >
              <LogOut size={20} color="#FF3B5C" />
              <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </View>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#0A0A0A',
    borderBottomWidth: 1,
    borderBottomColor: '#1F1F1F',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#FF3B5C',
  },
  initialsPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FF3B5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginTop: 16,
  },
  userEmail: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    borderWidth: 2,
    borderColor: '#818CF8',
  },
  adminButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  menuSection: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF3B5C',
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FF3B5C',
  },
  version: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 24,
  },
  loggedOutSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  loggedOutIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loggedOutTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  loggedOutText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  signInPromptButton: {
    width: '100%',
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  signInPromptButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  signUpPromptButton: {
    width: '100%',
    backgroundColor: '#1A1A1A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#22C55E',
  },
  signUpPromptButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#22C55E',
  },
});
