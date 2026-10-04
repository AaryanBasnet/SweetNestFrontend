import LegalPage from "../components/common/LegalPage";

const SECTIONS = [
  {
    heading: "Information we collect",
    body: [
      "We only collect what we need to take, bake and deliver your order:",
      {
        list: [
          "Account details: your name, email address and password (stored only as a secure hash, never in plain text).",
          "Delivery details: the addresses and phone numbers you save or enter at checkout.",
          "Orders: the cakes you order, your customisations, cake messages and any photo you upload for a custom cake.",
          "Reviews, wishlist items and messages you send us through the contact form.",
        ],
      },
    ],
  },
  {
    heading: "Payments",
    body: [
      "Payments are handled by eSewa. We never see or store your eSewa login or wallet details; we only receive confirmation of whether a payment succeeded.",
      "SweetNest currently runs eSewa in sandbox (test) mode. No real money is charged, and orders placed through the site are for demonstration only.",
    ],
  },
  {
    heading: "How we use your information",
    body: [
      {
        list: [
          "To process, bake and deliver your orders and show you their status.",
          "To send emails you need, such as order updates and password-reset codes.",
          "To keep your cart, wishlist and rewards points across visits.",
          "To find and fix technical problems with the site.",
        ],
      },
      "We do not sell your personal information or share it for advertising.",
    ],
  },
  {
    heading: "Services we rely on",
    body: [
      "A few trusted providers process data on our behalf, only as needed to run the site:",
      {
        list: [
          "eSewa, for payments.",
          "Cloudinary, to store cake and upload images.",
          "An email provider, to send order and account emails.",
          "Our hosting providers, to run the website and its database.",
          "An error-tracking service, which may receive technical details when something breaks.",
        ],
      },
    ],
  },
  {
    heading: "Storage in your browser",
    body: [
      "We use your browser's local storage to keep you signed in and to remember your cart, wishlist and checkout progress. We do not use advertising or tracking cookies. Signing out or clearing your browser data removes this information from your device.",
    ],
  },
  {
    heading: "Keeping your data safe",
    body: [
      "Passwords are hashed, connections to the site are encrypted, and access to order data is limited to your account and our staff. No system is perfectly secure, but we take reasonable steps to protect your information.",
    ],
  },
  {
    heading: "Your choices",
    body: [
      "You can view and update your profile and saved addresses at any time from your account. To have your account and personal data deleted, contact us and we will remove it, except where we must keep order records.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "We may update this policy as SweetNest grows. When we do, we will change the date at the top of this page.",
    ],
  },
];

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 4, 2026"
      intro="This policy explains what information SweetNest collects when you use our website, why we collect it, and how we look after it."
      sections={SECTIONS}
    />
  );
}
