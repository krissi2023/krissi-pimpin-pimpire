# 🔑 Stripe API Keys Setup Guide

This guide will help you configure your Stripe API keys to enable payments in your application.

## Step 1: Create Environment Files

You need to create `.env` files in two locations (these files are already in `.gitignore` so they won't be committed):

### Backend Environment File
```bash
# Location: diamondz-playhouse/backend/.env
# Copy from .env.example and update with your actual keys
```

### Frontend Environment File
```bash
# Location: diamondz-playhouse/frontend/.env
# Copy from .env.example and update with your actual keys
```

## Step 2: Get Your Stripe Keys

1. Go to your Stripe Dashboard: https://dashboard.stripe.com/test/apikeys
2. You'll find two types of keys:
   - **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for live mode)
   - **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)

## Step 3: Configure Backend (.env)

Create `diamondz-playhouse/backend/.env` with your keys:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE

# Stripe Webhook Secrets (see Step 4 for how to get these)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_WEBHOOK_SECRET_DEV=whsec_your_webhook_secret_here
STRIPE_WEBHOOK_SECRET_TEST=whsec_your_webhook_secret_here
STRIPE_WEBHOOK_SECRET_PROD=whsec_your_webhook_secret_here

# Database Configuration (MongoDB or PostgreSQL)
DATABASE_URL=mongodb://localhost:27017/diamondz-playhouse

# JWT Configuration (change this to a random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Payment Configuration (prices in cents)
COMIC_BASE_PRICE=999
PUZZLE_BASE_PRICE=499
WALLPAPER_BASE_PRICE=299
```

## Step 4: Configure Frontend (.env)

Create `diamondz-playhouse/frontend/.env` with your publishable key:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

## Step 5: Set Up Webhook Secret (Optional for Development)

Webhooks are used to receive payment confirmations from Stripe.

### For Local Development:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
4. Copy the webhook signing secret (starts with `whsec_`) to your backend `.env`

### For Production:
1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Add your production webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for (at minimum: `checkout.session.completed`)
5. Copy the webhook signing secret to your production environment variables

## Step 6: Verify Setup

After creating the `.env` files:

1. **Check files are created:**
   ```bash
   ls -la diamondz-playhouse/backend/.env
   ls -la diamondz-playhouse/frontend/.env
   ```

2. **Start the backend:**
   ```bash
   cd diamondz-playhouse/backend
   npm start
   ```
   Look for: `✓ Stripe initialized successfully` in the logs

3. **Start the frontend (in a new terminal):**
   ```bash
   cd diamondz-playhouse/frontend
   npm start
   ```
   Frontend should start at http://localhost:3000

4. **Test a payment:**
   - Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC (e.g., 123)
   - Any ZIP code (e.g., 12345)

## Important Notes

⚠️ **Security Reminders:**
- Never commit `.env` files to git (they're in `.gitignore`)
- Never share your secret keys publicly
- Use test keys (`sk_test_` and `pk_test_`) for development
- Use live keys (`sk_live_` and `pk_live_`) only in production

✅ **What's Already Configured:**
- Payment routes: `/api/payments/create-checkout-session`
- Webhook handlers: `/api/webhooks/stripe`, `/api/webhooks/stripe-dev`, `/api/webhooks/stripe-test`, `/api/webhooks/stripe-prod`
- Frontend Stripe checkout integration
- Comic, puzzle, and wallpaper purchase flows

## Quick Copy-Paste Templates

### Backend .env (Replace YOUR_KEYS)
```bash
cp diamondz-playhouse/backend/.env.example diamondz-playhouse/backend/.env
# Then edit the file and replace the placeholder keys
```

### Frontend .env (Replace YOUR_KEY)
```bash
cp diamondz-playhouse/frontend/.env.example diamondz-playhouse/frontend/.env
# Then edit the file and replace the placeholder key
```

## Troubleshooting

**Error: "No API key provided"**
- Check that `.env` files exist
- Verify keys start with `sk_test_` or `pk_test_`
- Restart your backend/frontend servers after adding keys

**Error: "Invalid API Key"**
- Make sure you copied the entire key
- Check for extra spaces before/after the key
- Verify you're using the correct key type (secret vs publishable)

**Webhook errors:**
- For development, webhook secret is optional
- Use Stripe CLI for local webhook testing
- Production webhooks must be configured in Stripe Dashboard

## Need Help?

- Stripe Test Cards: https://stripe.com/docs/testing
- Stripe API Docs: https://stripe.com/docs/api
- Webhook Guide: https://stripe.com/docs/webhooks
