# PayPal Integration Credentials

## PayPal Sandbox Credentials

**Client ID:**
```
AVdvysklSwyV2x4J9f7ea5ub5GFkbn2MwHSfH9pbvMeIhwh-2P-mV42nvZTx_REepL2F69MwU6GNKEzU
```

**Client Secret:**
```
EPynzeIH5Dbce2Z7XpHjFO4Ofw_0Du95f7YaAdLUcpwcdtAI14lQV6B46zEmNOnJ7K7RuKr44vDwgJKg
```

## Environment Variables

These credentials are already configured in your `.env` file:
- `EXPO_PUBLIC_PAYPAL_CLIENT_ID` - Client ID (public, safe for frontend)
- `PAYPAL_CLIENT_SECRET` - Client Secret (private, do not expose in frontend)

## Payment Platform

- **Mode:** Sandbox (for testing)
- **Monthly Subscription Price:** $20 USD

## Implementation Notes

### Access Control
1. Users must be logged in to access content
2. Users must have an active subscription to watch videos
3. Subscriptions are stored in Supabase `subscriptions` table
4. Subscription status is checked on:
   - App initialization
   - User login
   - Before accessing video content

### Payment Flow
1. User selects PayPal payment platform
2. WebView opens PayPal checkout page
3. User completes payment on PayPal
4. Payment success redirects back to app
5. Subscription is saved to Supabase
6. User gains access to all content for 30 days

### Database Schema Required

You'll need to create a `subscriptions` table in Supabase:

```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  payment_method TEXT NOT NULL,
  transaction_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  start_date TIMESTAMPTZ NOT NULL,
  expiry_date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own subscriptions
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Policy to allow users to insert their own subscriptions
CREATE POLICY "Users can insert their own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to update their own subscriptions
CREATE POLICY "Users can update their own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);
```

## M-Pesa Integration

M-Pesa integration is currently not configured. The payment flow shows M-Pesa as an option but displays a message that it's not yet available. You can implement M-Pesa integration later by:

1. Getting M-Pesa API credentials
2. Creating a backend endpoint to handle M-Pesa payments (required for security)
3. Updating `lib/paypal.ts` to include M-Pesa payment processing

## Important Security Notes

⚠️ **The Client Secret should NEVER be exposed in frontend code.** The current implementation uses a WebView approach for PayPal which is secure. For production, consider:

1. Setting up a backend to handle PayPal authentication
2. Using PayPal's server-side APIs for order creation and capture
3. Implementing webhook handlers for subscription renewals and cancellations

## Testing

To test the PayPal integration:
1. Sign in to the app
2. Try to access a video
3. You'll be redirected to the subscription page
4. Select PayPal
5. Complete payment in the sandbox environment
6. Upon success, you'll have access to all content

## Production Checklist

Before going live:
- [ ] Switch from sandbox to production PayPal credentials
- [ ] Set up backend endpoints for secure payment processing
- [ ] Implement webhook handlers for subscription events
- [ ] Add proper error handling and retry logic
- [ ] Implement subscription renewal reminders
- [ ] Add subscription cancellation flow
- [ ] Test payment flows thoroughly
- [ ] Set up monitoring and alerts for payment failures
