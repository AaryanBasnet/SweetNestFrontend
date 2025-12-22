/**
 * Admin Settings Page
 * Store settings and configuration
 */

import { useState } from 'react';
import { Save, Store, Bell, CreditCard, Truck, Shield } from 'lucide-react';
import { PageHeader } from '../../components/admin/shared';
import { toast } from 'react-toastify';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('store');

  const tabs = [
    { id: 'store', label: 'Store Info', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'delivery', label: 'Delivery', icon: Truck },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your store settings"
        actions={
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
        }
      />

      <div className="flex gap-8">
        {/* Sidebar Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-dark/60 hover:bg-dark/5'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl p-6 border border-dark/5">
          {activeTab === 'store' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif text-dark">Store Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Store Name</label>
                  <input
                    type="text"
                    defaultValue="SweetNest Bakery"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Contact Email</label>
                  <input
                    type="email"
                    defaultValue="contact@sweetnest.com"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Phone Number</label>
                  <input
                    type="tel"
                    defaultValue="+977 9801234567"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Currency</label>
                  <select className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent">
                    <option>NPR (Rs.)</option>
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">Store Address</label>
                <textarea
                  rows={3}
                  defaultValue="Kathmandu, Nepal"
                  className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif text-dark">Notification Settings</h3>

              <div className="space-y-4">
                {[
                  { label: 'New order notifications', description: 'Get notified when a new order is placed' },
                  { label: 'Low stock alerts', description: 'Get alerts when products are running low' },
                  { label: 'Customer reviews', description: 'Get notified of new customer reviews' },
                  { label: 'Daily sales report', description: 'Receive daily sales summary via email' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-cream/50 rounded-xl">
                    <div>
                      <p className="font-medium text-dark">{item.label}</p>
                      <p className="text-sm text-dark/50">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif text-dark">Payment Methods</h3>
              <p className="text-dark/50">Configure accepted payment methods for your store.</p>

              <div className="space-y-4">
                {[
                  { label: 'Cash on Delivery', enabled: true },
                  { label: 'eSewa', enabled: true },
                  { label: 'Khalti', enabled: false },
                  { label: 'Bank Transfer', enabled: true },
                ].map((method, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-dark/10 rounded-xl">
                    <span className="font-medium text-dark">{method.label}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={method.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-dark/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif text-dark">Delivery Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Delivery Fee</label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Free Delivery Above</label>
                  <input
                    type="number"
                    defaultValue={1500}
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-3 p-4 border border-dark/10 rounded-xl cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-accent border-dark/20 rounded focus:ring-accent" />
                  <div>
                    <p className="font-medium text-dark">Enable Next Day Delivery</p>
                    <p className="text-sm text-dark/50">Allow customers to choose next day delivery option</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-serif text-dark">Security Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-2 border border-dark/10 rounded-lg focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <button className="px-4 py-2 bg-dark text-white rounded-lg text-sm font-medium hover:bg-dark/90 transition-colors">
                Update Password
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
