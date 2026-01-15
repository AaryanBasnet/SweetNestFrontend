import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function FooterList({ title, items }) {
  return (
    <div>
      <h4 className="font-body text-sm sm:text-base text-dark mb-4 sm:mb-6">
        {title}
      </h4>
      <ul className="flex flex-col gap-3 sm:gap-4">
        {items.map((item) => (
          <li key={item.label}>
            <Link
              to={item.href}
              className="font-body text-sm sm:text-base text-dark/60 hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success("Thanks for subscribing! 🎂");
    setEmail("");
  };

  const shopLinks = [
    { label: "All Cakes", href: "/menu" },
    { label: "Cupcakes", href: "/menu?category=cupcakes" },
    { label: "Macarons", href: "/menu?category=macarons" },
    { label: "Wedding", href: "/menu?category=wedding" },
    { label: "Custom Orders", href: "/custom" },
  ];

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Rewards", href: "/rewards" },
    { label: "Wishlist", href: "/wishlist" },
  ];

  return (
    <footer className="bg-white w-full pt-12 sm:pt-16 lg:pt-20 pb-8 sm:pb-10 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 border-t border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-0 mb-12 sm:mb-16 lg:mb-20">
        {/* Newsletter */}
        <div className="w-full lg:w-auto lg:flex-1 lg:max-w-[592px]">
          <h3 className="font-heading text-2xl sm:text-3xl text-dark mb-3 sm:mb-4">
            SweetNest<span className="text-accent">.</span>
          </h3>
          <p className="font-body text-sm sm:text-base text-dark/60 mb-6 sm:mb-8 max-w-[380px]">
            Stay sweet. Join our newsletter for exclusive recipes, early access
            to new collections, and a sweet surprise on your birthday.
          </p>
          <form
            onSubmit={handleNewsletterSubmit}
            className="flex flex-col sm:flex-row gap-2 sm:gap-2 max-w-full sm:max-w-[448px]"
          >
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 sm:px-6 py-3">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent w-full outline-none text-dark font-body text-sm sm:text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-dark text-white px-6 py-3 rounded-md font-body text-sm uppercase hover:bg-accent transition-colors"
            >
              Join
            </button>
          </form>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8 sm:gap-12 lg:gap-20 lg:ml-auto">
          <FooterList title="Shop" items={shopLinks} />
          <FooterList title="Company" items={companyLinks} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 sm:pt-8 border-t border-gray-200/50">
        <p className="font-body text-[10px] sm:text-xs text-dark/40 uppercase tracking-widest text-center sm:text-left">
          © 2025 SweetNest Bakery. All rights reserved.
        </p>
        <div className="flex gap-4 sm:gap-6">
          <button
            onClick={() => toast.info("Privacy Policy coming soon")}
            className="font-body text-[10px] sm:text-xs text-dark/40 uppercase tracking-widest hover:text-dark transition-colors"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => toast.info("Terms of Use coming soon")}
            className="font-body text-[10px] sm:text-xs text-dark/40 uppercase tracking-widest hover:text-dark transition-colors"
          >
            Terms of Use
          </button>
        </div>
      </div>
    </footer>
  );
}
