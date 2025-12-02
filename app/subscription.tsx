import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Smartphone, Check, ArrowLeft } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';

type PaymentPlatform = 'paypal' | 'mpesa' | null;

const PAYMENT_PLATFORMS = {
  mpesa: {
    name: 'M-Pesa',
    price: 'KSh 250',
    currency: 'KSH',
    amount: 250,
    icon: Smartphone,
    color: '#00A84F',
    description: 'Pay with M-Pesa mobile money',
  },
  paypal: {
    name: 'PayPal',
    price: '$20',
    currency: 'USD',
    amount: 20,
    icon: CreditCard,
    color: '#003087',
    description: 'Pay securely with PayPal',
  },
};

const PLAN_FEATURES = [
  'Unlimited streaming',
  'HD quality',
  'Watch on any device',
  'Cancel anytime',
  'Monthly subscription',
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { activateSubscription, isLoggedIn } = useAppState();
  const [selectedPlatform, setSelectedPlatform] = useState<PaymentPlatform>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedPlatform) {
      Alert.alert('Select Payment Platform', 'Please select a payment platform to continue.');
      return;
    }

    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please sign in to subscribe.');
      router.push('/sign-in');
      return;
    }

    const platform = PAYMENT_PLATFORMS[selectedPlatform];
    console.log('[Subscription] Initiating payment...', {
      platform: selectedPlatform,
      amount: platform.amount,
      currency: platform.currency,
    });

    Alert.alert(
      'Payment Integration',
      `Ready to process ${platform.price} payment via ${platform.name}. Please provide payment gateway credentials.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/(home)')}
      >
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Subscribe Monthly</Text>
          <Text style={styles.subtitle}>
            Select your payment platform to get started
          </Text>
        </View>

        <View style={styles.platformsSection}>
          <Text style={styles.sectionTitle}>Choose Payment Platform</Text>
          
          {Object.entries(PAYMENT_PLATFORMS).map(([key, platform]) => {
            const Icon = platform.icon;
            const isSelected = selectedPlatform === key;
            
            return (
              <TouchableOpacity
                key={key}
                style={[
                  styles.platformCard,
                  isSelected && styles.platformCardSelected,
                ]}
                onPress={() => setSelectedPlatform(key as PaymentPlatform)}
                activeOpacity={0.7}
              >
                <View style={styles.platformHeader}>
                  <View style={styles.platformIconContainer}>
                    <Icon size={32} color={platform.color} />
                  </View>
                  <View style={styles.platformInfo}>
                    <Text style={styles.platformName}>{platform.name}</Text>
                    <Text style={styles.platformDescription}>{platform.description}</Text>
                  </View>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Check size={20} color="#FFFFFF" />
                    </View>
                  )}
                </View>
                
                {isSelected && (
                  <View style={styles.pricingSection}>
                    <View style={styles.pricingDivider} />
                    <View style={styles.pricingDetails}>
                      <View>
                        <Text style={styles.pricingLabel}>Monthly Subscription</Text>
                        <Text style={styles.pricingPrice}>{platform.price}/month</Text>
                      </View>
                      <View style={styles.featuresPreview}>
                        {PLAN_FEATURES.map((feature, index) => (
                          <View key={index} style={styles.featureRow}>
                            <Check size={16} color="#22C55E" />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedPlatform && (
          <TouchableOpacity
            style={[
              styles.subscribeButton,
              isProcessing && styles.subscribeButtonDisabled,
            ]}
            onPress={handlePayment}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={isProcessing ? ['#333333', '#1A1A1A'] : ['#22C55E', '#16A34A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscribeGradient}
            >
              {isProcessing ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.subscribeButtonText}>
                  Pay {PAYMENT_PLATFORMS[selectedPlatform].price}
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            By subscribing, you agree to our Terms & Conditions. Your subscription will auto-renew unless cancelled 24 hours before the renewal date.
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
  backButton: {
    position: 'absolute' as const,
    top: 60,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    lineHeight: 24,
  },
  platformsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  platformCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    overflow: 'hidden',
  },
  platformCardSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#1A2A1A',
  },
  platformHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  platformIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  platformInfo: {
    flex: 1,
  },
  platformName: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  platformDescription: {
    fontSize: 14,
    color: '#888',
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pricingSection: {
    paddingTop: 0,
  },
  pricingDivider: {
    height: 1,
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
  },
  pricingDetails: {
    padding: 20,
  },
  pricingLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#22C55E',
    marginBottom: 16,
  },
  featuresPreview: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 58,
  },
  subscribeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800' as const,
    letterSpacing: 0.5,
  },
  infoBox: {
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 18,
  },
});

