## Feature Enhancement.
-Automatiom: 'Adding Email Trigger' via Resend, when an invoice is created or a project status changes
-Reportimg:Interating a chart library like Recharts to handle the 'Real-time Analytics'
-Security: Implementing granular firebase security rules to ensure data isolation between different Users
## Developer Experience
-Types: Enhancing thr typescript interfaces between the frontend and the FireStore schema to ensure strict type safety
-Testing: Setting up integrated test for critical path (e.g creating invoice , payment flow e.t.c)


## Mobile Responsiveness
-Include a Easy and clean approach for sidebar on logged in users using mobile (Such that content and navigation appears more consise for mobile)

## Making App very useful (The Core Differentiators)
-The Actionable Dashboard Pattern: Instead  of just displaying Contacts or Projects e.t.c. The dashboard should have a "Needs Attention" Widget, E.g, Invoice Overdue , Follow Up Client X (last Contact 14 days ago), Upcoming project deadline in 2 days e.t.c
## Contextual Automation
-Smart Invoicing: When viewing a project, include a button that says "Generate Invoice" It pre-fills the data from the project details saving the user from re-typing
-Receipt Scanning: Include 'Snap save' Feature that users can take a photo of an expense receipt while using  a tool to auto-populate the expense amount and date
## Quick Action Menu
-A global keyword shortcut (like cmd+k) to create a new Contact or invoice from *anywhere* in he app without navigation to thr section

# Proposed Feature Extension
-Client Portal: Allow users to generate a "Public view" link for invoice or project. The client can view the status and pay the invoice without  needing to login
-Time Traclking: Add a Timer button on projects to display Hours spent and how many quoted
-Tax Estimation  Logic:  Based on Income (Invoices and Expenses)cala=culate a rough 'Tax owed' Estimate 

# Monetization and Onboarding Logic
-User selects Teir on onboarding page (see sample of onboardingpage is opened current in a project named paypilot )
## Teirs include;
### Free:
-Limit to 10 active invoices, 20 contacts and 20 expenses 
-Watermark "powered by [Appname] on generated invoices
### Pro Teir: Yearly = $12 (Recommend as suggestion)
-Unlimited Records, no water mark, Support and custom pdf templates
### Lifetime = $50 ( For first 100 Users)

## Firebase Security Rules (the gatekeeper)
-We *WONT* rely on frontend checks for limit
-Create a plans collection for user invoice and security rules to verify the count

### Onboarding / Upgrade plan
-Use stripe for checkout
-webhocks to listen for checkout session completed
-when the webhook hits, update to new teir if truely true
-Frontend should use a hook that checks the firestore flag to unlock features
-Managing Limit Logic implementation ( increment counters for invoice e.t.c to stop Free teir Users if exceed limit is true)
# Admin Endpoints (Use a sidebar nav structure that seperates 'Active work' from 'Configuration')
-Dashboard (Action Items)
-Projects (The container for all work)
-Invoices (The money)
-Expenses (The cost)
--Management(Secondary Level)
-Contacts(the address book)
-Reports(Aggregated Insights)
-Extra-Smart user monitor for free Users to avoid them exceeding usage
-Setting(Profile, subscription/upgrade button) (manually downgrade or upgrade user user search and select)

# Grace Period
-If card declines dont delete user data immediately , implement a 7-days grace period where app displays a payment failed banner, update billing to keep account active

## customer portal: 
-Use stripe customer portal to manage billings, update and cancel sub e.t.c

## Subscription workflow
-Always display a upgrade button somewhere when user teir is free
-User Registered and exceed usage = Trigger Ugrade UI 'Youre reached your limit.......' = Redirect to Stripe on user click for payment =Webhook fires and recieve the success event and updates user = App ui refreshes , Limit disappear immediately , User continues working
