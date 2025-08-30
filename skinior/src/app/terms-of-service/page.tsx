import React from "react";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Please read these terms carefully before using our service.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-sm text-gray-400 mb-8">
              <strong className="text-white">Last updated:</strong> August 30,
              2025
            </p>

            <h2 className="text-white">Agreement to Terms</h2>
            <p className="text-gray-300">
              These Terms of Service (&quot;Terms&quot;) govern your use of the Skinior
              platform and services provided by ROXATE LTD (&quot;we,&quot; &quot;our,&quot; or
              &quot;us&quot;). By accessing or using our service, you agree to be bound by
              these Terms.
            </p>

            <h2 className="text-white">Description of Service</h2>
            <p className="text-gray-300">
              Skinior is an AI-powered skincare platform that provides
              personalized skincare analysis, recommendations, and routine
              tracking. Our service includes:
            </p>
            <ul className="text-gray-300">
              <li>Skin analysis and assessment tools</li>
              <li>Personalized product recommendations</li>
              <li>Routine tracking and progress monitoring</li>
              <li>Educational content and resources</li>
              <li>Community features and support</li>
            </ul>

            <h2 className="text-white">User Accounts</h2>

            <h3 className="text-white">Account Creation</h3>
            <p className="text-gray-300">
              To use certain features of our service, you must create an
              account. You agree to:
            </p>
            <ul className="text-gray-300">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be responsible for all activities under your account</li>
            </ul>

            <h3 className="text-white">Account Termination</h3>
            <p className="text-gray-300">
              We reserve the right to terminate or suspend your account at our
              discretion, with or without notice, for violations of these Terms
              or for other conduct that we determine to be harmful to our
              service or other users.
            </p>

            <h2 className="text-white">Acceptable Use</h2>
            <p className="text-gray-300">
              You agree not to use our service to:
            </p>
            <ul className="text-gray-300">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful, offensive, or inappropriate content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of our service</li>
              <li>Use automated tools or bots without permission</li>
              <li>Share account credentials with others</li>
            </ul>

            <h2 className="text-white">Content and Intellectual Property</h2>

            <h3 className="text-white">User Content</h3>
            <p className="text-gray-300">
              You retain ownership of content you submit to our service. By
              submitting content, you grant us a non-exclusive, royalty-free
              license to use, display, and distribute your content in connection
              with providing our service.
            </p>

            <h3 className="text-white">Our Content</h3>
            <p className="text-gray-300">
              All content, features, and functionality of our service, including
              but not limited to text, graphics, logos, and software, are owned
              by ROXATE LTD and are protected by copyright, trademark, and other
              intellectual property laws.
            </p>

            <h2 className="text-white">Privacy and Data Protection</h2>
            <p className="text-gray-300">
              Your privacy is important to us. Our collection and use of
              personal information is governed by our{" "}
              <a
                href="/privacy-policy"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Privacy Policy
              </a>
              , which is incorporated into these Terms by reference.
            </p>

            <h2 className="text-white">Medical Disclaimer</h2>
            <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 border-l-4 border-yellow-400 p-4 my-6 rounded-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-200">
                    <strong className="text-yellow-100">Important:</strong>{" "}
                    Skinior is not a substitute for professional medical advice,
                    diagnosis, or treatment. Our recommendations are for
                    informational purposes only and should not replace
                    consultation with qualified healthcare professionals. Always
                    consult your dermatologist or healthcare provider before
                    making significant changes to your skincare routine or for
                    any skin concerns.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-white">Service Availability</h2>
            <p className="text-gray-300">
              We strive to provide continuous service but cannot guarantee
              uninterrupted availability. We may perform maintenance, updates,
              or suspend service temporarily without notice. We are not liable
              for any damages resulting from service interruptions.
            </p>

            <h2 className="text-white">Payment Terms</h2>
            <p className="text-gray-300">
              Some features of our service may require payment. By purchasing
              our services, you agree to:
            </p>
            <ul className="text-gray-300">
              <li>Pay all applicable fees and charges</li>
              <li>Provide accurate billing information</li>
              <li>Authorize us to charge your payment method</li>
              <li>Receive invoices electronically</li>
            </ul>
            <p className="text-gray-300">
              All payments are non-refundable except as required by law or as
              specified in our refund policy.
            </p>

            <h2 className="text-white">Disclaimers and Limitations</h2>

            <h3 className="text-white">Service &quot;As Is&quot;</h3>
            <p className="text-gray-300">
              Our service is provided &quot;as is&quot; and &quot;as available&quot; without
              warranties of any kind, either express or implied, including but
              not limited to merchantability, fitness for a particular purpose,
              and non-infringement.
            </p>

            <h3 className="text-white">Limitation of Liability</h3>
            <p className="text-gray-300">
              To the maximum extent permitted by law, ROXATE LTD shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of our service.
            </p>

            <h2 className="text-white">Indemnification</h2>
            <p className="text-gray-300">
              You agree to indemnify and hold harmless ROXATE LTD, its officers,
              directors, employees, and agents from any claims, damages, losses,
              or expenses arising from your use of our service or violation of
              these Terms.
            </p>

            <h2 className="text-white">Governing Law</h2>
            <p className="text-gray-300">
              These Terms shall be governed by and construed in accordance with
              the laws of England and Wales. Any disputes arising from these
              Terms shall be subject to the exclusive jurisdiction of the courts
              of England and Wales.
            </p>

            <h2 className="text-white">Dispute Resolution</h2>
            <p className="text-gray-300">
              We encourage you to contact us first to resolve any disputes. If
              we cannot resolve a dispute informally, it may be resolved through
              binding arbitration in accordance with the rules of the
              International Chamber of Commerce.
            </p>

            <h2 className="text-white">Changes to Terms</h2>
            <p className="text-gray-300">
              We may modify these Terms at any time. We will notify you of
              changes by posting the updated Terms on our website and updating
              the &quot;Last updated&quot; date. Your continued use of our service after
              changes become effective constitutes acceptance of the updated
              Terms.
            </p>

            <h2 className="text-white">Severability</h2>
            <p className="text-gray-300">
              If any provision of these Terms is found to be unenforceable, the
              remaining provisions will remain in full force and effect.
            </p>

            <h2 className="text-white">Entire Agreement</h2>
            <p className="text-gray-300">
              These Terms, together with our Privacy Policy, constitute the
              entire agreement between you and ROXATE LTD regarding the use of
              our service.
            </p>

            <h2 className="text-white">Contact Information</h2>
            <p className="text-gray-300">
              If you have any questions about these Terms, please contact us:
            </p>
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-xl mt-6 border border-gray-600">
              <p className="text-gray-300">
                <strong className="text-white">ROXATE LTD</strong>
              </p>
              <p className="text-gray-300">
                Registered Office: 71-75 Shelton Street, Covent Garden, London,
                WC2H 9JQ, United Kingdom
              </p>
              <p className="text-gray-300">Email: legal@roxate.co.uk</p>
              <p className="text-gray-300">Company Number: 16232608</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
