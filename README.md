# WedPlan

WedPlan is a wedding-planning marketplace where customers can discover and book wedding services, vendors can manage listings and bookings, and admins can moderate the platform.

## Features

- Customer, vendor, and admin dashboards with server-authorized APIs
- Browse, search, filter, and sort approved wedding services
- Vendor service listings, booking management, and image uploads
- Customer booking requests with event-date validation
- Admin user, service, and transaction management
- Better Auth email/password and Google sign-in
- Stripe Checkout monthly Premium subscription with webhook verification
- Responsive olive/sage wedding-themed interface

## Technology

- Next.js 16, React, TypeScript, Tailwind CSS, ShadCN UI
- Better Auth with MongoDB
- Express.js and MongoDB business API
- Stripe Checkout and signed Stripe webhooks
- ImgBB for image uploads

The client and API are maintained in separate repositories:

- Client: https://github.com/srutinokrak/wedora-client
- Server: https://github.com/srutinokrak/wedora-server
- Live website: **Add the deployed client URL before submission.**

## Local setup

Requirements: Node.js, npm, MongoDB Atlas (or another MongoDB deployment), Google OAuth credentials (optional for Google sign-in), an ImgBB API key, and Stripe CLI/test credentials for testing payments.

1. Clone the client repository and install dependencies:

   ```bash
   npm install
   ```

2. Create the client `.env` file:

   ```dotenv
   BETTER_AUTH_DB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
   BETTER_AUTH_URL=http://localhost:3000
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   NEXT_PUBLIC_IMGBB_API_KEYS=
   WEDORA_API_URL=http://localhost:5000
   NEXT_PUBLIC_WEDORA_API_URL=http://localhost:5000
   ```

   Keep credentials private. Configure Google OAuth's authorized redirect URI as `http://localhost:3000/api/auth/callback/google`.

3. In a separate terminal, clone the server repository, install dependencies, and configure its `.env` using [the server README](https://github.com/srutinokrak/wedora-server):

   ```bash
   npm install
   npm run dev
   ```

4. Start the client:

   ```bash
   npm run dev
   ```

5. Open http://localhost:3000.

## Stripe test webhooks

Run the API server and the Next.js client, then forward Stripe test events to the local API:

```powershell
stripe listen --events "checkout.session.completed,checkout.session.async_payment_succeeded,checkout.session.async_payment_failed,checkout.session.expired,customer.subscription.updated,customer.subscription.deleted,invoice.payment_failed" --forward-to http://localhost:5000/stripe/webhook
```

Set the `whsec_...` value printed by Stripe CLI as `STRIPE_WEBHOOK_SECRET` in the **server** environment. Start Checkout from the vendor dashboard; a synthetic Stripe CLI fixture is not tied to an existing WedPlan transaction.

Premium is $29 USD per month. The return page only reads the transaction status; Premium is enabled or removed by verified server-side Stripe webhook events.

## Application URLs

- Home: `/`
- Browse services: `/services`
- Sign in: `/sign-in`
- Sign up: `/sign-up`
- Service details: `/services/[id]`
- Role dashboard: `/dashboard`
- Profile settings: `/profile-settings`
- Better Auth API: `/api/auth`
- Business API: server repository, default local URL `http://localhost:5000`
- Stripe webhook: server `/stripe/webhook`

## Deployment and submission

Deploy the client and server separately. Configure the client environment variables in the client host and server variables in the API host. Set the production client URL as the server's `APP_URL` and `BETTER_AUTH_URL`; configure the deployed server's webhook URL in Stripe.

- Live website: **Add the deployed client URL**
- Client repository: https://github.com/srutinokrak/wedora-client
- Server repository: https://github.com/srutinokrak/wedora-server
- Evaluation admin email/password: provide privately through the assignment submission, not in this README or source control.

Create the initial admin account out of band in the MongoDB `user` collection. Public registration only creates customer or vendor accounts.
