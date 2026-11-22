<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# WedPlan Assignment Requirements

## Project Scope

Build a complete role-based wedding planning platform named **WedPlan**.

- Technology stack:
  - Next.js
  - TypeScript/JavaScript
  - ShadCN UI
  - Express.js
  - MongoDB
  - Better Auth
  - Stripe Checkout
  - ImgBB or another suitable image hosting service
  - Framer Motion or Motion
- The client and server must be in separate GitHub repositories.
- Minimum meaningful commits:
  - 20 client-side commits
  - 12 server-side commits
- Commit messages must describe the actual work.
- Keep all implementation steps organized and test each feature before moving forward.

## Working Instructions

- Read the complete requirement before starting implementation.
- Implement the project step by step based on the approved plan.
- Do not begin a new major feature unless the current feature is complete and verified.
- Use reusable components and keep client/server code organized.
- Never expose secrets or commit `.env` files.
- Never rely only on frontend role checks.
- Use meaningful loading, empty, error, success, and notification states.
- Use toast notifications instead of browser alert dialogs.
- Keep the existing olive/ sage wedding theme consistent unless the user requests a new design.

## Roles


There are three application roles:

- Customer
- Vendor
- Admin

Users must not access another role's dashboard or protected API. Role verification must also happen on the server.

## Layout

### Navbar

- Display logo/name: WedPlan.
- Public routes:
  - Home
  - Browse Services
  - Sign In
  - Sign Up
- Authenticated routes:
  - Home
  - Browse Services
  - User profile dropdown
- Profile dropdown:
  - User name
  - Profile image
  - Dashboard
  - Profile Settings
  - Logout
- Navbar content must update immediately after authentication state changes.
- Use a polished light olive/sage navbar and an olive primary action color.

### Footer

- Logo and short description
- Important navigation links
- Contact information
- Social media links
- Copyright information

## Public Routes and Pages

### Home

Banner:
- Clear wedding-focused headline
- Short description
- CTA button labeled Explore Wedding Services
- Wedding-themed background or illustration

Featured Wedding Services:
- Show at least six approved and active services from MongoDB.
- Card fields:
  - Service image
  - Service name
  - Category
  - Price
  - Location
  - Vendor information
  - View Details button

Wedding Service Categories:
- Photography & Videography
- Wedding Venues
- Decoration & Florist
- Catering Services
- Makeup & Styling
- Wedding Fashion
- Category links must filter or navigate to matching services.

Additional sections:
- Required: Why Choose WedPlan
- Add one section from:
  - How WedPlan Works
  - Popular Wedding Destinations
  - Customer Testimonials
  - Wedding Planning Tips
- Apply smooth Framer Motion/Motion animations without visual clutter.

### Browse Services

- Public route.
- List only approved and active services.
- Responsive card layout.
- Card fields match the featured service cards.
- Implement:
  - Search by service name
  - Category filtering
  - Location filtering
  - Price sorting ascending and descending
  - Loading state
  - Empty state
- An unauthenticated user who clicks View Details or tries to book must be redirected to Sign In.

### Service Details

- Dynamic route: `/services/[id]`
- Display:
  - Service name
  - Multiple service images
  - Category
  - Description
  - Price
  - Location
  - Vendor information
  - Booking option
- Booking rules:
  - Customers only
  - Vendors cannot book their own services
  - Admins cannot submit customer bookings
  - Invalid IDs must show an appropriate error
  - Only approved and active services are available

## Authentication

Use Better Auth.

### Sign Up

- Full name
- Email
- Password
- Optional profile image uploaded using ImgBB
- Role selection:
  - Vendor
  - Customer
- Password requirements:
  - Minimum six characters
  - At least one uppercase letter
  - At least one lowercase letter
- Support credential registration and Google authentication.
- Show success and error messages.
- Redirect by role after registration.
- Admin accounts must never be created through public registration.

### Sign In

- Email
- Password
- Support credential login and Google login.
- Show success and error messages.
- Redirect according to role.
- Blocked users must not access protected features.

### Protected Routes

- Protect all dashboards.
- Customers cannot access vendor/admin dashboards.
- Vendors cannot access customer/admin dashboards.
- Admins cannot access customer/vendor dashboards.
- Unauthenticated users must be redirected to Sign In.
- Protected API routes require server-side JWT verification and role authorization.
- Private routes must work after page refresh.

## Dashboard Structure

- Use a separate dashboard layout.
- Include sidebar and main content area.
- Navigation must be role-specific.
- Responsive layout for desktop, tablet, and mobile.
- Include statistics cards and consistent themed styling.

### Vendor Dashboard

- Overview:
  - Total services
  - Active services
  - Pending booking requests
  - Accepted bookings
  - Current subscription plan
- Add Service:
  - Service name
  - Category
  - Description
  - Price
  - Location
  - Service image uploaded to ImgBB or another image host
  - Required-field server validation
  - Default status: Pending
  - Store in `services`
- Free-plan limit:
  - Maximum three active services
- Premium-plan limit:
  - Unlimited active services
- My Services:
  - Show the logged-in vendor's services
  - View, update, delete, and manage availability
  - Show approval status
  - Rejected services must not be public
- Booking Requests:
  - Customer information
  - Service information
  - Event date
  - Event location
  - Message
  - Status
  - Accept/reject actions
  - Pending requests only can be processed once
  - Vendors cannot manage another vendor's requests
- Subscription:
  - Free plan details
  - Basic booking request management
  - Premium plan details
  - Premium badge
  - Unlimited services
  - Upgrade to Premium action

### Customer Dashboard

- Overview:
  - Total bookings
  - Pending bookings
  - Accepted bookings
  - Rejected bookings
- My Bookings:
  - Service name and image
  - Vendor information
  - Event date
  - Event location
  - Booking status
  - Request date
  - View details
  - Cancel pending requests
- Customers cannot modify or cancel another customer's bookings.
- Accepted, rejected, or cancelled bookings cannot be cancelled again.
- Profile settings must allow editable profile fields.

### Admin Dashboard

- Overview:
  - Total registered users
  - Total vendors
  - Total customers
  - Total services
  - Pending services
  - Total transactions
- Manage Users:
  - View all users
  - Search by name/email
  - Filter by role
  - View details
  - Block/unblock users
  - Blocked users cannot access protected features
- Manage Services:
  - View all submitted services
  - Search/filter services
  - Review pending services
  - Approve/reject services
  - Change published status
  - Delete inappropriate services
  - Public pages must show only approved and active services
- Transactions:
  - Vendor information
  - Subscription plan
  - Payment amount
  - Payment status
  - Transaction date
  - Admin cannot manually mark failed payments successful

## Booking Request System

- Show a booking form on service details.
- Fields:
  - Event date
  - Event location
  - Additional message
- Automatically identify:
  - Customer
  - Selected vendor
  - Service
- Store in `bookings`.
- Default status: Pending.
- Booking status values:
  - Pending
  - Accepted
  - Rejected
  - Cancelled
- Prevent customers from booking their own service.
- Prevent duplicate active booking requests for the same service and event date.
- Show appropriate success and error messages.

## Stripe Payment System

- Premium vendor feature.
- Free vendors may not publish more than three active services.
- Use Stripe Checkout in test mode.
- Vendor upgrade flow:
  - Vendor clicks Upgrade to Premium
  - Server creates a Stripe Checkout session
  - Redirect to Stripe Checkout
  - Success redirects to Payment Success
  - Cancel redirects to Payment Cancel
- Payment Success:
  - Show confirmation
  - Save transaction
  - Activate premium only after verified payment confirmation
- Store transactions in `transactions`.
- Webhook requirements:
  - Never trust the frontend success redirect for activation
  - Verify Stripe webhook events
  - Keep secret keys only on the server
  - Prevent unauthorized subscription sessions
  - Handle cancellation and expiration

## Profile Management

- Vendors and customers can update:
  - Name
  - Profile image
  - Other editable profile information
- Users must not change their own role or subscription status.
- Show success/error feedback.

## JWT and Server Authorization

- Generate or obtain a secure JWT for authenticated users.
- Store and transmit the token securely.
- Create JWT verification middleware.
- Create role middleware for Admin, Vendor, and Customer.
- Protect private API routes.
- Verify resource ownership before updates/deletes.
- Validate request data on the server.
- Never trust a client-provided user ID or role for authorization.
- Return appropriate HTTP status codes:
  - 401 Unauthorized
  - 403 Forbidden
- Invalid or expired JWT tokens must be rejected.

## Database Architecture

MongoDB is the primary database.

Better Auth manages authentication-related collections.

Business collections:

### users

- Managed through Better Auth plus application fields
- name
- email
- image
- role
- isBlocked
- businessName
- subscriptionPlan
- subscriptionExpiresAt

### services

- vendorId
- serviceName
- category
- description
- price
- location
- images
- status
- createdAt

### bookings

- serviceId
- vendorId
- customerId
- eventDate
- eventLocation
- message
- status
- createdAt

### transactions

- vendorId
- plan
- amount
- currency
- stripeSessionId
- stripeSubscriptionId
- status
- createdAt

Do not create unnecessary duplicate collections for the same information.

## Loading and Error Handling

Show meaningful loaders while:
- Fetching services
- Loading dashboard data
- Submitting forms
- Processing booking requests
- Processing payments

Handle:
- Invalid routes
- Failed API requests
- Invalid form submissions
- Unauthorized access
- Missing database records
- Failed image uploads
- Invalid service IDs

## UI Requirements

- Fully responsive on desktop, tablet, and mobile.
- Professional wedding-themed interface.
- Consistent spacing, typography, shadows, and colors.
- Use ShadCN components appropriately.
- Build reusable components.
- Avoid unnecessary animations and visual clutter.
- All buttons and navigation links must work.
- No reload, CORS, 404, or 504 issues on production routes.

## Deployment and Verification

- Live site must work correctly.
- Reloading private and dynamic routes must not break authentication or return errors.
- Stripe test checkout and webhook flow must work in deployment.
- Evaluation admin credentials must work.
- Test all major features and role permissions.
- Test booking requests with customer and vendor accounts.
- Test invalid/expired JWTs.
- Test Stripe success/cancel flows.
- Ensure no secret credentials are exposed.
- Deploy before the deadline.

## README Requirements

README.md must include:
- Project name and description
- Important features
- Technology stack
- Installation instructions
- How to run locally
- Live website link
- Client repository link
- Server repository link
- Environment variables
- Required application URLs

Sensitive environment variables include:
- MongoDB connection string
- Better Auth secret/configuration
- Google OAuth credentials
- Stripe secret key
- Stripe webhook secret
- ImgBB API key

## Submission Requirements

- Admin email
- Admin password
- Live site link
- Server repository link
- Client repository link
