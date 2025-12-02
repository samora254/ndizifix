import Constants from 'expo-constants';
import { supabase } from './supabase';

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

export const saveSubscription = async (userId: string, paymentMethod: 'paypal' | 'mpesa', transactionId: string) => {
  try {
    console.log('[Subscription] Saving subscription for user:', userId);
    
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + 1);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        payment_method: paymentMethod,
        transaction_id: transactionId,
        status: 'active',
        start_date: new Date().toISOString(),
        expiry_date: expiryDate.toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id',
      });

    if (error) {
      console.error('[Subscription] Error saving subscription:', error);
      throw error;
    }

    console.log('[Subscription] Subscription saved successfully');
    return data;
  } catch (error) {
    console.error('[Subscription] Error:', error);
    throw error;
  }
};

export const checkSubscription = async (userId: string): Promise<{ isActive: boolean; expiryDate?: string }> => {
  try {
    console.log('[Subscription] Checking subscription for user:', userId);
    
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.log('[Subscription] No active subscription found');
        return { isActive: false };
      }
      console.error('[Subscription] Error checking subscription:', error);
      throw error;
    }

    if (!data) {
      return { isActive: false };
    }

    const expiryDate = new Date(data.expiry_date);
    const now = new Date();
    const isActive = now < expiryDate;

    console.log('[Subscription] Subscription status:', { isActive, expiryDate: data.expiry_date });

    if (!isActive) {
      await supabase
        .from('subscriptions')
        .update({ status: 'expired', updated_at: new Date().toISOString() })
        .eq('user_id', userId);
    }

    return { isActive, expiryDate: data.expiry_date };
  } catch (error) {
    console.error('[Subscription] Error:', error);
    return { isActive: false };
  }
};
