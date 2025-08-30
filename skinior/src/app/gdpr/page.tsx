import React from "react";

const GDPRPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 tracking-tight">
            GDPR Compliance
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Your privacy matters to us. Learn about how we collect, use, and
            protect your personal data in compliance with GDPR regulations.
          </p>
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 space-y-8 border border-gray-700">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Skinior is committed to protecting your privacy and complying with
              the General Data Protection Regulation (GDPR). This page explains
              how we collect, use, store, and protect your personal information
              when you use our services.
            </p>
          </section>

          {/* Data Controller */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Data Controller
            </h2>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
              <p className="text-gray-300">
                <strong className="text-white">ROXATE LTD</strong>
                <br />
                Company Number: 16232608
                <br />
                Registered Office: 71-75 Shelton Street, Covent Garden, London,
                WC2H 9JQ, United Kingdom
                <br />
                Email: privacy@roxate.co.uk
                <br />
                Data Protection Officer: dpo@roxate.co.uk
              </p>
            </div>
          </section>

          {/* Data We Collect */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              What Personal Data Do We Collect?
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Account Information
                </h3>
                <p className="text-gray-300">
                  Name, email address, password, and profile information when
                  you create an account.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Usage Data
                </h3>
                <p className="text-gray-300">
                  Information about how you use our app, including features
                  accessed, time spent, and preferences.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Device Information
                </h3>
                <p className="text-gray-300">
                  Device type, operating system, browser type, and IP address
                  for technical purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Skincare Data
                </h3>
                <p className="text-gray-300">
                  Information about your skin type, concerns, routine, and
                  product usage to provide personalized recommendations.
                </p>
              </div>
            </div>
          </section>

          {/* Legal Basis */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Legal Basis for Processing
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Consent</h3>
                <p className="text-gray-300">
                  You have given clear consent for us to process your data for
                  specific purposes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Contract
                </h3>
                <p className="text-gray-300">
                  Processing is necessary for the performance of our service
                  agreement with you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Legitimate Interest
                </h3>
                <p className="text-gray-300">
                  Processing is necessary for our legitimate business interests,
                  such as improving our services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Legal Obligation
                </h3>
                <p className="text-gray-300">
                  Processing is necessary to comply with legal obligations.
                </p>
              </div>
            </div>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Do We Share Your Data?
            </h2>
            <p className="text-gray-300 mb-4">
              We do not sell your personal data to third parties. We may share
              your data in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-gray-300 space-y-2">
              <li>With your explicit consent</li>
              <li>
                With service providers who help us operate our platform (under
                strict confidentiality agreements)
              </li>
              <li>When required by law or to protect our rights</li>
              <li>
                In connection with a business transfer (with notice to you)
              </li>
            </ul>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              How Long Do We Keep Your Data?
            </h2>
            <p className="text-gray-300">
              We retain your personal data for as long as necessary to provide
              our services and comply with legal obligations. Typically, we keep
              account data while your account is active and for a reasonable
              period after account closure. Usage data and analytics are
              generally retained for 2 years for service improvement purposes.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Your GDPR Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Access
                </h3>
                <p className="text-gray-300 text-sm">
                  Request a copy of the personal data we hold about you.
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Rectification
                </h3>
                <p className="text-gray-300 text-sm">
                  Request correction of inaccurate or incomplete data.
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Erasure
                </h3>
                <p className="text-gray-300 text-sm">
                  Request deletion of your personal data in certain
                  circumstances.
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Restriction
                </h3>
                <p className="text-gray-300 text-sm">
                  Request limitation of how we process your data.
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Portability
                </h3>
                <p className="text-gray-300 text-sm">
                  Request your data in a structured, machine-readable format.
                </p>
              </div>
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
                <h3 className="text-lg font-medium text-white mb-2">
                  Right to Object
                </h3>
                <p className="text-gray-300 text-sm">
                  Object to processing based on legitimate interests or direct
                  marketing.
                </p>
              </div>
            </div>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar technologies to enhance your experience
              and analyze usage patterns.
            </p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Essential Cookies
                </h3>
                <p className="text-gray-300">
                  Required for the website to function properly. Cannot be
                  disabled.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Analytics Cookies
                </h3>
                <p className="text-gray-300">
                  Help us understand how visitors use our website to improve our
                  services.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Functional Cookies
                </h3>
                <p className="text-gray-300">
                  Remember your preferences and settings for a better user
                  experience.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Contact Us
            </h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about this GDPR notice or wish to
              exercise your rights, please contact us:
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-xl p-6 border border-gray-600">
              <p className="text-gray-300">
                <strong className="text-white">ROXATE LTD</strong>
                <br />
                Registered Office: 71-75 Shelton Street, Covent Garden, London,
                WC2H 9JQ, United Kingdom
                <br />
                Email: privacy@roxate.co.uk
                <br />
                Data Protection Officer: dpo@roxate.co.uk
                <br />
                Response Time: We aim to respond within 30 days
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Updates to This Notice
            </h2>
            <p className="text-gray-300">
              We may update this GDPR notice from time to time. We will notify
              you of any significant changes by email or through our platform.
              The latest version will always be available on this page.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Last updated: August 30, 2025
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GDPRPage;
