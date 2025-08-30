import React from "react";

const CookiePolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            How we use cookies and similar technologies to enhance your
            experience.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-sm text-gray-400 mb-8">
              <strong className="text-white">Last updated:</strong> August 30,
              2025
            </p>

            <h2 className="text-white">What Are Cookies?</h2>
            <p className="text-gray-300">
              Cookies are small text files that are stored on your device when
              you visit our website or use our mobile application. They help us
              provide you with a better experience by remembering your
              preferences and understanding how you use our service.
            </p>

            <h2 className="text-white">How We Use Cookies</h2>
            <p className="text-gray-300">
              ROXATE LTD uses cookies and similar technologies for the following
              purposes:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Essential Functionality:</strong>{" "}
                To enable core features of our service
              </li>
              <li>
                <strong className="text-white">Analytics:</strong> To understand
                how users interact with our platform
              </li>
              <li>
                <strong className="text-white">Personalization:</strong> To
                remember your preferences and settings
              </li>
              <li>
                <strong className="text-white">Security:</strong> To protect
                against fraud and unauthorized access
              </li>
              <li>
                <strong className="text-white">Marketing:</strong> To show
                relevant advertisements (with your consent)
              </li>
            </ul>

            <h2 className="text-white">Types of Cookies We Use</h2>

            <h3 className="text-white">Essential Cookies</h3>
            <p className="text-gray-300">
              These cookies are necessary for our website to function properly.
              They enable core functionality such as security, network
              management, and accessibility. You cannot opt out of these cookies
              without affecting how our service works.
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg my-4 border border-gray-600">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Examples:</strong> Session
                management, authentication, security tokens
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Duration:</strong> Session or
                persistent (up to 1 year)
              </p>
            </div>

            <h3 className="text-white">Analytics Cookies</h3>
            <p className="text-gray-300">
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously. This
              helps us improve our service.
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg my-4 border border-gray-600">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Examples:</strong> Google
                Analytics, page views, session duration
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Duration:</strong> Up to 2 years
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Consent:</strong> Required before
                use
              </p>
            </div>

            <h3 className="text-white">Functional Cookies</h3>
            <p className="text-gray-300">
              These cookies enable enhanced functionality and personalization.
              They remember your choices and preferences to provide a better
              user experience.
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg my-4 border border-gray-600">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Examples:</strong> Language
                preferences, theme settings, form data
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Duration:</strong> Up to 1 year
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Consent:</strong> Required before
                use
              </p>
            </div>

            <h3 className="text-white">Marketing Cookies</h3>
            <p className="text-gray-300">
              These cookies are used to track visitors across websites to
              display relevant advertisements. They remember your browsing
              habits to show you personalized ads.
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-lg my-4 border border-gray-600">
              <p className="text-sm text-gray-300">
                <strong className="text-white">Examples:</strong> Advertising
                pixels, retargeting cookies
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Duration:</strong> Up to 1 year
              </p>
              <p className="text-sm text-gray-300">
                <strong className="text-white">Consent:</strong> Required before
                use
              </p>
            </div>

            <h2 className="text-white">Third-Party Cookies</h2>
            <p className="text-gray-300">
              Some cookies are set by third-party services that appear on our
              website. We have limited control over these cookies. The third
              parties that set these cookies include:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Google Analytics:</strong> For
                website analytics and performance monitoring
              </li>
              <li>
                <strong className="text-white">Stripe:</strong> For secure
                payment processing
              </li>
              <li>
                <strong className="text-white">Intercom:</strong> For customer
                support and communication
              </li>
              <li>
                <strong className="text-white">Sentry:</strong> For error
                tracking and performance monitoring
              </li>
            </ul>

            <h2 className="text-white">Your Cookie Choices</h2>

            <h3 className="text-white">Managing Cookies</h3>
            <p className="text-gray-300">
              You can control and manage cookies in several ways:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Browser Settings:</strong> Most
                browsers allow you to control cookies through settings
              </li>
              <li>
                <strong className="text-white">Our Cookie Banner:</strong> Use
                our cookie consent banner to manage preferences
              </li>
              <li>
                <strong className="text-white">Opt-out Links:</strong> Click
                opt-out links provided by third-party services
              </li>
            </ul>

            <h3 className="text-white">Browser-Specific Instructions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-white">Chrome</h4>
                <p className="text-sm text-gray-300">
                  Settings → Privacy and security → Cookies and other site data
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Firefox</h4>
                <p className="text-sm text-gray-300">
                  Settings → Privacy & Security → Cookies and Site Data
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Safari</h4>
                <p className="text-sm text-gray-300">
                  Preferences → Privacy → Manage Website Data
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white">Edge</h4>
                <p className="text-sm text-gray-300">
                  Settings → Cookies and site permissions → Cookies and site
                  data
                </p>
              </div>
            </div>

            <h2 className="text-white">Cookie Consent</h2>
            <p className="text-gray-300">
              When you first visit our website, you&apos;ll see a cookie consent
              banner. This banner allows you to:
            </p>
            <ul className="text-gray-300">
              <li>Accept all cookies</li>
              <li>Reject non-essential cookies</li>
              <li>Customize your cookie preferences</li>
              <li>View detailed information about each cookie category</li>
            </ul>
            <p className="text-gray-300">
              You can change your cookie preferences at any time by clicking the
              &quot;Cookie Settings&quot; link in our website footer.
            </p>

            <h2 className="text-white">Impact of Disabling Cookies</h2>
            <p className="text-gray-300">
              Disabling certain cookies may affect your experience on our
              website:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Essential Cookies:</strong>{" "}
                Disabling these will prevent our website from functioning
                properly
              </li>
              <li>
                <strong className="text-white">Analytics Cookies:</strong> We
                won&apos;t be able to improve our service based on usage data
              </li>
              <li>
                <strong className="text-white">Functional Cookies:</strong> Some
                features may not work as expected
              </li>
              <li>
                <strong className="text-white">Marketing Cookies:</strong>{" "}
                You&apos;ll see fewer personalized advertisements
              </li>
            </ul>

            <h2 className="text-white">Data Storage and Security</h2>
            <p className="text-gray-300">
              Cookie data is stored securely and encrypted where appropriate. We
              implement appropriate technical and organizational measures to
              protect cookie data from unauthorized access, alteration, or
              disclosure.
            </p>

            <h2 className="text-white">Updates to This Policy</h2>
            <p className="text-gray-300">
              We may update this Cookie Policy from time to time to reflect
              changes in our practices or for legal reasons. We will notify you
              of any significant changes by posting the updated policy on this
              page and updating the &quot;Last updated&quot; date.
            </p>

            <h2 className="text-white">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about our use of cookies or this Cookie
              Policy, please contact us:
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-xl mt-6 border border-gray-600">
              <p className="text-gray-300">
                <strong className="text-white">ROXATE LTD</strong>
              </p>
              <p className="text-gray-300">
                Registered Office: 71-75 Shelton Street, Covent Garden, London,
                WC2H 9JQ, United Kingdom
              </p>
              <p className="text-gray-300">Email: privacy@roxate.co.uk</p>
              <p className="text-gray-300">
                Data Protection Officer: dpo@roxate.co.uk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage;
