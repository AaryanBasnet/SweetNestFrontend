import LegalPage from "../components/common/LegalPage";

const SECTIONS = [
  {
    heading: "Sandbox payments",
    body: [
      "SweetNest currently processes payments through eSewa in sandbox (test) mode. No real money is taken, and orders placed on the site are not baked or delivered. These terms describe how the service will work once live payments are enabled.",
    ],
  },
  {
    heading: "Your account",
    body: [
      "You are responsible for keeping your login details safe and for activity on your account. Please give accurate information, especially your delivery address and phone number, so we can reach you.",
    ],
  },
  {
    heading: "Orders and prices",
    body: [
      {
        list: [
          "Prices are shown in Nepalese rupees (Rs.) and include the options you choose, such as weight, tiers and decorations.",
          "An order is confirmed once payment succeeds and you receive an order confirmation.",
          "We may cancel an order if an item is unavailable or a price was shown in error; any payment taken will be refunded.",
        ],
      },
    ],
  },
  {
    heading: "Custom cakes",
    body: [
      "The 3D designer shows a preview of your cake. The finished cake is handmade, so colours, decorations and lettering may vary slightly from the preview.",
      "You must have the right to use any photo or text you add to a cake. We may decline messages or images that are offensive or infringe someone else's rights.",
    ],
  },
  {
    heading: "Delivery",
    body: [
      "We aim to deliver your order fresh and on time. Delays can happen because of traffic or weather; we will keep you updated through order tracking. Please make sure someone is available to receive the cake, as cakes are perishable.",
    ],
  },
  {
    heading: "Cancellations and refunds",
    body: [
      "Because cakes are baked to order, cancellations may not be possible once baking has started. If your cake arrives damaged or not as ordered, contact us within 24 hours of delivery with a photo and we will make it right with a replacement or refund.",
    ],
  },
  {
    heading: "Allergens",
    body: [
      "Our kitchen handles wheat, dairy, eggs, nuts and other allergens. Eggless options do not mean a cake is free from all allergens. If you have a serious allergy, please contact us before ordering.",
    ],
  },
  {
    heading: "Rewards and promotions",
    body: [
      "Rewards points and promotional codes have no cash value, cannot be transferred, and may change or end at any time.",
    ],
  },
  {
    heading: "Using the site",
    body: [
      "Please do not misuse the site, for example by trying to access other people's accounts, disrupting the service, or copying our content and images without permission.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The date at the top of this page shows when they last changed. Continuing to use SweetNest after a change means you accept the updated terms.",
    ],
  },
];

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="October 4, 2026"
      intro="These terms apply when you browse SweetNest, create an account or place an order. Please read them before ordering."
      sections={SECTIONS}
    />
  );
}
