import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Smartphone, Check, ArrowLeft } from 'lucide-react-native';
import { useAppState } from '@/contexts/AppStateContext';

type PaymentMethod = 'paypal' | 'mpesa' | null;

const SUBSCRIPTION_PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: 'KSh 499',
    duration: '30 days',
    features: ['Unlimited streaming', 'HD quality', 'Watch on any device', 'Cancel anytime'],
  },
  {
    id: 'yearly',
    name: 'Yearly',
    price: 'KSh 4,999',
    duration: '365 days',
    features: ['Unlimited streaming', 'HD quality', 'Watch on any device', 'Cancel anytime', 'Save 17%'],
    popular: true,
  },
];

export default function SubscriptionScreen() {
  const router = useRouter();
  const { activateSubscription, isLoggedIn } = useAppState();
  const [selectedPlan, setSelectedPlan] = useState<string>('yearly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      Alert.alert('Select Payment Method', 'Please select a payment method to continue.');
      return;
    }

    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please sign in to subscribe.');
      router.push('/sign-in');
      return;
    }

    console.log('[Subscription] Processing payment...', {
      plan: selectedPlan,
      method: selectedPaymentMethod,
    });

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      
      const expiryDate = new Date();
      if (selectedPlan === 'monthly') {
        expiryDate.setDate(expiryDate.getDate() + 30);
      } else {
        expiryDate.setDate(expiryDate.getDate() + 365);
      }

      activateSubscription(expiryDate.toISOString());

      Alert.alert(
        'Payment Successful!',
        'Your subscription has been activated. Enjoy unlimited streaming!',
        [
          {
            text: 'Start Watching',
            onPress: () => router.replace('/(tabs)/(home)'),
          },
        ]
      );
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock unlimited access to thousands of movies and series
          </Text>
        </View>

        <View style={styles.plansContainer}>
          {SUBSCRIPTION_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              style={[
                styles.planCard,
                selectedPlan === plan.id && styles.planCardSelected,
              ]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>MOST POPULAR</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planDuration}>per {plan.duration}</Text>
              </View>

              <View style={styles.featuresContainer}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <Check size={18} color="#22C55E" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {selectedPlan === plan.id && (
                <View style={styles.selectedIndicator}>
                  <Check size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          <TouchableOpacity
            style={[
              styles.paymentButton,
              selectedPaymentMethod === 'paypal' && styles.paymentButtonSelected,
            ]}
            onPress={() => setSelectedPaymentMethod('paypal')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentIconContainer}>
              <CreditCard size={28} color="#003087" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>PayPal</Text>
              <Text style={styles.paymentDescription}>Pay securely with PayPal</Text>
            </View>
            {selectedPaymentMethod === 'paypal' && (
              <Check size={24} color="#22C55E" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentButton,
              selectedPaymentMethod === 'mpesa' && styles.paymentButtonSelected,
            ]}
            onPress={() => setSelectedPaymentMethod('mpesa')}
            activeOpacity={0.7}
          >
            <View style={styles.paymentIconContainer}>
              <Smartphone size={28} color="#00A84F" />
            </View>
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentName}>M-Pesa</Text>
              <Text style={styles.paymentDescription}>Pay with M-Pesa mobile money</Text>
            </View>
            {selectedPaymentMethod === 'mpesa' && (
              <Check size={24} color="#22C55E" />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.subscribeButton,
            (!selectedPaymentMethod || isProcessing) && styles.subscribeButtonDisabled,
          ]}
          onPress={handlePayment}
          disabled={!selectedPaymentMethod || isProcessing}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              !selectedPaymentMethod || isProcessing
                ? ['#333333', '#1A1A1A']
                : ['#22C55E', '#16A34A']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.subscribeGradient}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.subscribeButtonText}>
                Subscribe Now
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

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
  plansContainer: {
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    position: 'relative' as const,
  },
  planCardSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#1A2A1A',
  },
  popularBadge: {
    position: 'absolute' as const,
    top: -12,
    left: 20,
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800' as const,
    letterSpacing: 1,
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: '800' as const,
    color: '#22C55E',
    marginBottom: 4,
  },
  planDuration: {
    fontSize: 14,
    color: '#888',
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: '#CCCCCC',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute' as const,
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  paymentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#2A2A2A',
  },
  paymentButtonSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#1A2A1A',
  },
  paymentIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#888',
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
