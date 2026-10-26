'use client';
/** Implements the subscribe modal component and its related interface behavior. */


import { useState } from 'react';
import { X } from 'lucide-react';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Renders the subscribe modal interface. */
export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /** Handles the submit interaction and its related state changes. */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
      setCompany('');
      
      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
      }, 2000);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={28} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
            {/* Left Side - Newsletter Preview */}
            <div className="bg-[#003c59] text-white p-12 flex flex-col justify-between relative overflow-hidden">
              {/* Background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#004d73] rounded-full opacity-20 blur-3xl -z-10" />
              
              {isSubmitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-green-500 rounded-full p-6 mb-6">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-3">
                    Subscription Confirmed!
                  </h3>
                  <p className="text-blue-100 text-lg">
                    Check your email for the latest updates
                  </p>
                </div>
              ) : (
                <>
                  {/* MMT Logo Badge */}
                  <div className="flex items-center gap-2 mb-8">
                    <div className="bg-red-600 text-white font-black text-sm px-3 py-1 rounded">
                      MMT
                    </div>
                    <span className="text-white font-bold text-xl">TODAY</span>
                  </div>

                  {/* Newsletter Title */}
                  <div>
                    <h2 className="text-4xl font-black mb-4 leading-tight tracking-tight">
                      E-NEWSLETTER
                    </h2>
                    
                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                      Join the Tooling Technology Community
                    </p>

                    {/* Newsletter Preview Description */}
                    <div className="bg-white/10 rounded-lg p-6 backdrop-blur">
                      <p className="text-sm text-blue-50 leading-relaxed">
                        Receive the latest industry news, expert insights, webinars, and resources delivered directly to your inbox every week.
                      </p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mt-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-blue-100">Weekly industry updates</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-blue-100">Exclusive webinars & events</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-blue-100">Expert tips & best practices</span>
                    </div>
                  </div>

                  {/* Privacy Note */}
                  <div className="text-xs text-blue-200 mt-auto pt-6 border-t border-blue-800">
                    We respect your privacy. Unsubscribe anytime.
                  </div>
                </>
              )}
            </div>

            {/* Right Side - Signup Form */}
            <div className="bg-gray-50 p-12 flex flex-col justify-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Get Started Today
              </h3>
              <p className="text-gray-600 text-sm mb-8">
                Enter your information below to subscribe
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Company Input */}
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-800 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company (optional)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                  />
                </div>

                {/* Privacy Checkbox */}
                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    defaultChecked
                    className="mt-1 w-5 h-5 text-red-600 border-gray-300 rounded focus:ring-2 focus:ring-red-600 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                    I agree to receive emails from Tooling Technology and accept the <a href="#" className="text-red-600 font-semibold hover:underline">privacy policy</a>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-8 flex items-center justify-center gap-2 text-lg"
                >
                  {isLoading && (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {isLoading ? 'Subscribing...' : 'SUBSCRIBE NOW'}
                </button>
              </form>

              {/* Already Subscribed */}
              <div className="text-center pt-6 mt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Already subscribed? <a href="#" className="text-red-600 font-semibold hover:underline">Manage preferences</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
