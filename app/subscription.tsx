import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { CreditCard, Smartphone, Check, ArrowLeft, X, Tag } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { useAppState } from '@/contexts/AppStateContext';
import { useAdmin } from '@/contexts/AdminContext';
import { getPayPalClientId, saveSubscription } from '@/lib/paypal';

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
  const { activateSubscription, isLoggedIn, user } = useAppState();
  const { validateDiscountCode, markDiscountCodeAsUsed } = useAdmin();
  const [selectedPlatform, setSelectedPlatform] = useState<PaymentPlatform>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayPalWebView, setShowPayPalWebView] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountSuccessMessage, setDiscountSuccessMessage] = useState('');

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code');
      return;
    }

    setIsApplyingDiscount(true);
    setDiscountError('');
    
    await new Promise(resolve => setTimeout(resolve, 800));

    const validation = validateDiscountCode(discountCode.trim());
    
    if (validation.isValid) {
      setAppliedDiscount(validation.discount);
      setDiscountError('');
      setDiscountSuccessMessage(`${validation.discount}% discount applied successfully!`);
    } else {
      setDiscountError(validation.message);
      setAppliedDiscount(0);
      setDiscountSuccessMessage('');
    }
    
    setIsApplyingDiscount(false);
  };

  const handleRemoveDiscount = () => {
    setDiscountCode('');
    setAppliedDiscount(0);
    setDiscountError('');
    setDiscountSuccessMessage('');
  };

  const calculateFinalPrice = (originalAmount: number): number => {
    if (appliedDiscount > 0) {
      return originalAmount * (1 - appliedDiscount / 100);
    }
    return originalAmount;
  };

  const handlePayment = async () => {
    if (!selectedPlatform) {
      Alert.alert('Select Payment Platform', 'Please select a payment platform to continue.');
      return;
    }

    if (!isLoggedIn || !user) {
      Alert.alert('Login Required', 'Please sign in to subscribe.');
      router.push('/sign-in');
      return;
    }

    const platform = PAYMENT_PLATFORMS[selectedPlatform];
    const finalAmount = calculateFinalPrice(platform.amount);
    
    console.log('[Subscription] Initiating payment...', {
      platform: selectedPlatform,
      originalAmount: platform.amount,
      discount: appliedDiscount,
      finalAmount,
      currency: platform.currency,
    });

    if (selectedPlatform === 'mpesa') {
      Alert.alert(
        'M-Pesa Payment',
        'M-Pesa integration is not yet configured. Please use PayPal or contact support.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (selectedPlatform === 'paypal') {
      setIsProcessing(true);
      try {
        const clientId = getPayPalClientId();
        const returnUrl = encodeURIComponent('https://rork.app/payment-success');
        const cancelUrl = encodeURIComponent('https://rork.app/payment-cancel');
        
        const url = `https://www.sandbox.paypal.com/webapps/billing/plans/subscribe?plan_id=P-SUBSCRIPTION-PLAN-ID&vault=true&client-id=${clientId}&return_url=${returnUrl}&cancel_url=${cancelUrl}`;
        
        setPaypalUrl(url);
        setShowPayPalWebView(true);
      } catch (error) {
        console.error('[Subscription] Error initiating PayPal payment:', error);
        Alert.alert('Payment Error', 'Failed to initiate PayPal payment. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleWebViewNavigationStateChange = async (navState: any) => {
    console.log('[PayPal WebView] Navigation:', navState.url);

    if (navState.url.includes('payment-success') || navState.url.includes('subscription_id=')) {
      console.log('[PayPal] Payment successful!');
      setShowPayPalWebView(false);
      setIsProcessing(true);

      try {
        const urlParams = new URL(navState.url).searchParams;
        const subscriptionId = urlParams.get('subscription_id') || urlParams.get('ba_token') || `paypal_${Date.now()}`;
        
        if (user) {
          await saveSubscription(user.id, 'paypal', subscriptionId);
          
          const expiryDate = new Date();
          expiryDate.setMonth(expiryDate.getMonth() + 1);
          activateSubscription(expiryDate.toISOString());

          if (discountCode.trim() && appliedDiscount > 0) {
            markDiscountCodeAsUsed(discountCode.trim(), user.id);
          }

          Alert.alert(
            'Payment Successful!',
            'Your subscription is now active. Enjoy unlimited streaming!',
            [
              {
                text: 'Start Watching',
                onPress: () => router.replace('/(tabs)/(home)'),
              },
            ]
          );
        }
      } catch (error) {
        console.error('[Subscription] Error saving subscription:', error);
        Alert.alert(
          'Subscription Activation Error',
          'Payment was successful but we could not activate your subscription. Please contact support.',
          [{ text: 'OK' }]
        );
      } finally {
        setIsProcessing(false);
      }
    } else if (navState.url.includes('payment-cancel')) {
      console.log('[PayPal] Payment cancelled');
      setShowPayPalWebView(false);
      Alert.alert('Payment Cancelled', 'Your payment was cancelled.', [{ text: 'OK' }]);
    }
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
                        {appliedDiscount > 0 ? (
                          <View style={styles.priceContainer}>
                            <Text style={styles.originalPrice}>{platform.price}</Text>
                            <Text style={styles.pricingPrice}>
                              {platform.currency === 'KSH' ? 'KSh' : '$'}
                              {calculateFinalPrice(platform.amount).toFixed(0)}/month
                            </Text>
                            <View style={styles.discountBadge}>
                              <Text style={styles.discountBadgeText}>{appliedDiscount}% OFF</Text>
                            </View>
                          </View>
                        ) : (
                          <Text style={styles.pricingPrice}>{platform.price}/month</Text>
                        )}
                        {discountSuccessMessage ? (
                          <View style={styles.discountSuccessBanner}>
                            <Text style={styles.discountSuccessText}>{discountSuccessMessage}</Text>
                          </View>
                        ) : null}
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
          <View style={styles.discountSection}>
            <Text style={styles.discountSectionTitle}>Have a discount code?</Text>
            
            {appliedDiscount > 0 ? (
              <View style={styles.appliedDiscountContainer}>
                <View style={styles.appliedDiscountContent}>
                  <Tag size={20} color="#10B981" />
                  <View style={styles.appliedDiscountInfo}>
                    <Text style={styles.appliedDiscountCode}>{discountCode}</Text>
                    <Text style={styles.appliedDiscountText}>{appliedDiscount}% discount applied</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={handleRemoveDiscount} activeOpacity={0.7}>
                  <X size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.discountInputContainer}>
                <View style={styles.discountInputWrapper}>
                  <Tag size={20} color="#888" />
                  <TextInput
                    style={styles.discountInput}
                    value={discountCode}
                    onChangeText={(text) => {
                      setDiscountCode(text.toUpperCase());
                      setDiscountError('');
                    }}
                    placeholder="Enter code"
                    placeholderTextColor="#666"
                    autoCapitalize="characters"
                    maxLength={6}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.applyButton, isApplyingDiscount && styles.applyButtonDisabled]}
                  onPress={handleApplyDiscount}
                  disabled={isApplyingDiscount}
                  activeOpacity={0.7}
                >
                  {isApplyingDiscount ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.applyButtonText}>Apply</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
            
            {discountError ? (
              <Text style={styles.discountErrorText}>{discountError}</Text>
            ) : null}
          </View>
        )}

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
                  Pay {PAYMENT_PLATFORMS[selectedPlatform].currency === 'KSH' ? 'KSh' : '$'}
                  {calculateFinalPrice(PAYMENT_PLATFORMS[selectedPlatform].amount).toFixed(0)}
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

      <Modal
        visible={showPayPalWebView}
        animationType="slide"
        onRequestClose={() => setShowPayPalWebView(false)}
      >
        <SafeAreaView style={styles.webViewContainer} edges={['top']}>
          <View style={styles.webViewHeader}>
            <Text style={styles.webViewTitle}>Complete PayPal Payment</Text>
            <TouchableOpacity
              onPress={() => {
                setShowPayPalWebView(false);
                Alert.alert('Payment Cancelled', 'Your payment was cancelled.');
              }}
              style={styles.webViewCloseButton}
            >
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <WebView
            source={{ uri: paypalUrl }}
            onNavigationStateChange={handleWebViewNavigationStateChange}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webViewLoading}>
                <ActivityIndicator size="large" color="#003087" />
                <Text style={styles.webViewLoadingText}>Loading PayPal...</Text>
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  originalPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#666',
    textDecorationLine: 'line-through',
  },
  pricingPrice: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#22C55E',
    marginBottom: 16,
  },
  discountBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: '#FFFFFF',
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  webViewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  webViewCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webViewLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A0A0A',
  },
  webViewLoadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#888',
  },
  discountSection: {
    marginBottom: 24,
  },
  discountSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  discountInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  discountInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 16,
    gap: 12,
  },
  discountInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
    paddingVertical: 14,
    letterSpacing: 2,
  },
  applyButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: '#6366F1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  applyButtonDisabled: {
    backgroundColor: '#4B5563',
    opacity: 0.7,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  appliedDiscountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A2A1A',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    padding: 16,
  },
  appliedDiscountContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  appliedDiscountInfo: {
    flex: 1,
  },
  appliedDiscountCode: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  appliedDiscountText: {
    fontSize: 14,
    color: '#10B981',
    marginTop: 2,
  },
  discountErrorText: {
    fontSize: 14,
    color: '#EF4444',
    marginTop: 8,
  },
  discountSuccessBanner: {
    backgroundColor: '#10B98120',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  discountSuccessText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#10B981',
  },
});
