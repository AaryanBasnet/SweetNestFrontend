import { useState } from "react";
import { toast } from "react-toastify";
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Send,
  ChevronDown,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import { useSubmitContact } from "../hooks/contact/useContact";

const CONTACT_INFO = [
  {
    icon: MapPin,
    title: "Visit Us",
    lines: ["123 Baker Street, Suite 400", "Bhaktapur, Sirutar"],
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["hello@sweetnest.com", "We reply within 24 hours"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["9813585195", "Mon-Fri, 9am - 6pm"],
  },
];

const OPENING_HOURS = [
  { day: "Monday - Friday", hours: "8:00 AM - 8:00 PM", highlight: false },
  { day: "Saturday", hours: "9:00 AM - 9:00 PM", highlight: false },
  { day: "Sunday", hours: "10:00 AM - 6:00 PM", highlight: true },
];

const FAQS = [
  {
    question: "Do you offer gluten-free or vegan options?",
    answer:
      "Yes! We offer a variety of gluten-free and vegan cakes and pastries. Please check our menu or contact us for current availability.",
  },
  {
    question: "How far in advance should I order?",
    answer:
      "For custom cakes, we recommend ordering at least 3-5 days in advance. For large orders or wedding cakes, please contact us 2-4 weeks ahead.",
  },
  {
    question: "Do you deliver to my area?",
    answer:
      "We deliver within Kathmandu Valley. Delivery fees vary based on location. Contact us for delivery outside the valley.",
  },
  {
    question: "Can I customize a cake order?",
    answer:
      "Absolutely! We love creating custom designs. Share your ideas with us and we'll work together to make your dream cake a reality.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-dark">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-dark/60 text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const submitContact = useSubmitContact();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      await submitContact.mutateAsync(formData);
      toast.success("Message sent successfully! We'll get back to you soon.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full font-body bg-[#FDFCF8] text-dark">
      {/* Hero Section */}
      <section className="text-center pt-12 pb-8 px-6">
        <span className="inline-block bg-accent text-white px-5 py-2 rounded-full text-sm font-medium mb-6">
          We'd love to hear from you
        </span>
        <h1 className="text-h1 md:text-5xl font-heading mb-4">
          Let's talk <span className="italic text-accent">Cake.</span>
        </h1>
        <p className="text-dark/60 max-w-xl mx-auto">
          Whether you have a question about an order, want to collaborate, or
          just want to say hello, our team is ready to answer.
        </p>
      </section>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left - Contact Info Card */}
          <div className="bg-dark text-white rounded-3xl p-8 lg:p-10">
            <h2 className="text-2xl font-heading mb-8">Contact Information</h2>

            <div className="space-y-6">
              {CONTACT_INFO.map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-accent text-sm font-medium mb-1">
                      {item.title}
                    </p>
                    {item.lines.map((line, i) => (
                      <p
                        key={i}
                        className={i === 0 ? "text-white" : "text-white/60 text-sm"}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-10">
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100">
            <h2 className="text-2xl font-heading mb-8">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm text-dark/60 mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-accent transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-dark/60 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-accent transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark/60 mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What's this about?"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-accent transition-colors ${
                    errors.subject ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-dark/60 mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your sweet ideas..."
                  rows={4}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:border-accent transition-colors resize-none ${
                    errors.message ? 'border-red-500' : 'border-gray-200'
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitContact.isPending}
                className="w-full bg-dark text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-dark/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitContact.isPending ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100 max-w-md">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-dark" />
            <span className="font-medium">Opening Hours</span>
          </div>

          <div className="space-y-3">
            {OPENING_HOURS.map((item, index) => (
              <div
                key={index}
                className={`flex justify-between text-sm ${
                  item.highlight ? "text-accent" : "text-dark"
                }`}
              >
                <span>{item.day}</span>
                <span className={item.highlight ? "text-accent" : "text-dark/60"}>
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-h2 font-heading mb-2">Frequently Asked Questions</h2>
          <p className="text-dark/60">Quick answers to common questions.</p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </section>
    </div>
  );
}
