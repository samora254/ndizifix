import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID || 
  Constants.expoConfig?.extra?.paypalClientId || 
  'AVdvysklSwyV2x4J9f7ea5ub5GFkbn2MwHSfH9pbvMeIhwh-2P-mV42nvZTx_REepL2F69MwU6GNKEzU';

export const getPayPalClientId = () => PAYPAL_CLIENT_ID;

export const getPayPalApprovalUrl = (amount: number, currency: string): string => {
  const baseUrl = 'https://www.sandbox.paypal.com/webapps/billing/subscriptions/create';
  const returnUrl = encodeURIComponent('https://rork.app/payment-success');
  const cancelUrl = encodeURIComponent('https://rork.app/payment-cancel');
  
  return `${baseUrl}?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription&return_url=${returnUrl}&cancel_url=${cancelUrl}`;
};

interface SubscriptionData {
  userId: string;
  paymentMethod: 'paypal' | 'mpesa';
  transactionId: string;
  status: 'active' | 'expired';
  startDate: string;
  expiryDate: string;
  updatedAt: string;
}

const SUBSCRIPTION_STORAGE_KEY = '@subscription_data';

export const saveSubscription = async (userId: string, paymentMethod: 'paypal' | 'mpesa', transactionId: string) => {
  try {
    console.log('[Subscription] Saving subscription for user:', userId);
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const subscriptionData: SubscriptionData = {
      userId,
      paymentMethod,
      transactionId,
      status: 'active',
      startDate: new Date().toISOString(),
      expiryDate: expiryDate.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      `${SUBSCRIPTION_STORAGE_KEY}_${userId}`,
      JSON.stringify(subscriptionData)
    );

    console.log('[Subscription] Subscription saved successfully');
    return subscriptionData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('[Subscription] Error saving:', errorMessage);
    throw error;
  }
};

export const checkSubscription = async (userId: string): Promise<{ isActive: boolean; expiryDate?: string }> => {
  try {
    console.log('[Subscription] Checking subscription for user:', userId);
    
    const storedData = await AsyncStorage.getItem(`${SUBSCRIPTION_STORAGE_KEY}_${userId}`);
    
    if (!storedData) {
      console.log('[Subscription] No subscription found');
      return { isActive: false };
    }

    const data: SubscriptionData = JSON.parse(storedData);

    if (data.status !== 'active') {
      console.log('[Subscription] Subscription is not active');
      return { isActive: false };
    }

    const expiryDate = new Date(data.expiryDate);
    const now = new Date();
    const isActive = now < expiryDate;

    console.log('[Subscription] Subscription status:', { isActive, expiryDate: data.expiryDate });

    if (!isActive) {
      data.status = 'expired';
      data.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(
        `${SUBSCRIPTION_STORAGE_KEY}_${userId}`,
        JSON.stringify(data)
      );
    }

    return { isActive, expiryDate: data.expiryDate };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('[Subscription] Error checking:', errorMessage);
    return { isActive: false };
  }
};
