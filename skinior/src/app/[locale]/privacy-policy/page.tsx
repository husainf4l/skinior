import React from "react";
import Link from "next/link";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black pt-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            How we collect, use, and protect your personal information.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-700">
          <div className="prose prose-lg max-w-none prose-invert">
            <p className="text-sm text-gray-400 mb-8">
              <strong className="text-white">Last updated:</strong> August 30,
              2025
            </p>

            <h2 className="text-white">Introduction</h2>
            <p className="text-gray-300">
              ROXATE LTD (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;)
              operates the Skinior platform. This Privacy Policy explains how we
              collect, use, disclose, and safeguard your information when you
              use our website, mobile application, and services (collectively,
              the &quot;Service&quot;).
            </p>
            <p className="text-gray-300">
              By using our Service, you agree to the collection and use of
              information in accordance with this policy. We will not use or
              share your information with anyone except as described in this
              Privacy Policy.
            </p>

            <h2 className="text-white">Information We Collect</h2>

            <h3 className="text-white">Personal Information</h3>
            <p className="text-gray-300">
              We may collect the following personal information:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Account Information:</strong>{" "}
                Name, email address, password, date of birth
              </li>
              <li>
                <strong className="text-white">Profile Information:</strong>{" "}
                Skin type, concerns, preferences, and routine data
              </li>
              <li>
                <strong className="text-white">Communication Data:</strong>{" "}
                Messages, feedback, and support requests
              </li>
              <li>
                <strong className="text-white">Payment Information:</strong>{" "}
                Processed securely through third-party providers
              </li>
            </ul>

            <h3 className="text-white">Usage Information</h3>
            <p className="text-gray-300">
              We automatically collect certain information when you use our
              Service:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Device Information:</strong>{" "}
                Device type, operating system, browser type
              </li>
              <li>
                <strong className="text-white">Log Data:</strong> IP address,
                access times, pages viewed, app usage patterns
              </li>
              <li>
                <strong className="text-white">Analytics Data:</strong> Feature
                usage, session duration, error reports
              </li>
              <li>
                <strong className="text-white">Location Data:</strong> General
                location information (with your consent)
              </li>
            </ul>

            <h3 className="text-white">Cookies and Tracking Technologies</h3>
            <p className="text-gray-300">
              We use cookies and similar technologies to enhance your
              experience. See our
              <Link
                href="/cookie-policy"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                {" "}
                Cookie Policy
              </Link>{" "}
              for details.
            </p>

            <h2 className="text-white">How We Use Your Information</h2>
            <p className="text-gray-300">
              We use collected information for the following purposes:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Service Provision:</strong> To
                provide and maintain our skincare analysis service
              </li>
              <li>
                <strong className="text-white">Personalization:</strong> To
                customize your experience and recommendations
              </li>
              <li>
                <strong className="text-white">Communication:</strong> To send
                updates, newsletters, and respond to inquiries
              </li>
              <li>
                <strong className="text-white">Improvement:</strong> To analyze
                usage patterns and improve our services
              </li>
              <li>
                <strong className="text-white">Security:</strong> To detect and
                prevent fraud and unauthorized access
              </li>
              <li>
                <strong className="text-white">Legal Compliance:</strong> To
                comply with applicable laws and regulations
              </li>
            </ul>

            <h2 className="text-white">Information Sharing and Disclosure</h2>
            <p className="text-gray-300">
              We do not sell your personal information. We may share your
              information in these circumstances:
            </p>

            <h3 className="text-white">Service Providers</h3>
            <p className="text-gray-300">
              We may share information with trusted third-party service
              providers who assist us in operating our platform, such as:
            </p>
            <ul className="text-gray-300">
              <li>Cloud hosting and data storage providers</li>
              <li>Analytics and performance monitoring services</li>
              <li>Customer support and communication platforms</li>
              <li>Payment processing services</li>
            </ul>

            <h3 className="text-white">Legal Requirements</h3>
            <p className="text-gray-300">
              We may disclose your information if required by law, court order,
              or government request, or to protect our rights, property, or
              safety, or that of our users.
            </p>

            <h3 className="text-white">Business Transfers</h3>
            <p className="text-gray-300">
              In the event of a merger, acquisition, or sale of assets, your
              information may be transferred as part of the transaction. We will
              notify you before this occurs.
            </p>

            <h2 className="text-white">Data Security</h2>
            <p className="text-gray-300">
              We implement appropriate technical and organizational measures to
              protect your personal information:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Encryption:</strong> Data
                encrypted in transit and at rest
              </li>
              <li>
                <strong className="text-white">Access Controls:</strong> Limited
                access to personal data on a need-to-know basis
              </li>
              <li>
                <strong className="text-white">Regular Audits:</strong> Security
                assessments and vulnerability testing
              </li>
              <li>
                <strong className="text-white">Employee Training:</strong> Staff
                trained on data protection practices
              </li>
              <li>
                <strong className="text-white">Incident Response:</strong>{" "}
                Procedures for responding to security incidents
              </li>
            </ul>

            <h2 className="text-white">Data Retention</h2>
            <p className="text-gray-300">
              We retain your personal information only as long as necessary for
              the purposes outlined in this Privacy Policy, unless a longer
              retention period is required by law:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Account Data:</strong> Retained
                while your account is active and for 3 years after closure
              </li>
              <li>
                <strong className="text-white">Usage Data:</strong> Retained for
                2 years for analytics and service improvement
              </li>
              <li>
                <strong className="text-white">Communication Data:</strong>{" "}
                Retained for 5 years for legal and support purposes
              </li>
              <li>
                <strong className="text-white">Payment Data:</strong> Retained
                according to payment processor requirements
              </li>
            </ul>

            <h2 className="text-white">International Data Transfers</h2>
            <p className="text-gray-300">
              Your information may be transferred to and processed in countries
              other than your own. We ensure appropriate safeguards are in place
              for international transfers, including:
            </p>
            <ul className="text-gray-300">
              <li>
                Standard Contractual Clauses approved by the European Commission
              </li>
              <li>Adequacy decisions for certain countries</li>
              <li>Your explicit consent where required</li>
            </ul>

            <h2 className="text-white">Your Rights and Choices</h2>
            <p className="text-gray-300">
              Depending on your location, you may have the following rights:
            </p>
            <ul className="text-gray-300">
              <li>
                <strong className="text-white">Access:</strong> Request a copy
                of your personal information
              </li>
              <li>
                <strong className="text-white">Rectification:</strong> Correct
                inaccurate or incomplete information
              </li>
              <li>
                <strong className="text-white">Erasure:</strong> Request
                deletion of your personal information
              </li>
              <li>
                <strong className="text-white">Restriction:</strong> Limit how
                we process your information
              </li>
              <li>
                <strong className="text-white">Portability:</strong> Receive
                your data in a structured format
              </li>
              <li>
                <strong className="text-white">Objection:</strong> Object to
                processing based on legitimate interests
              </li>
              <li>
                <strong className="text-white">Withdraw Consent:</strong>{" "}
                Withdraw consent for processing based on consent
              </li>
            </ul>

            <h2 className="text-white">Children&apos;s Privacy</h2>
            <p className="text-gray-300">
              Our Service is not intended for children under 16 years of age. We
              do not knowingly collect personal information from children under
              16. If you are a parent or guardian and believe your child has
              provided us with personal information, please contact us.
            </p>

            <h2 className="text-white">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by:
            </p>
            <ul className="text-gray-300">
              <li>Posting the new Privacy Policy on this page</li>
              <li>Sending you an email notification</li>
              <li>Displaying a prominent notice in our application</li>
            </ul>
            <p className="text-gray-300">
              Your continued use of the Service after changes become effective
              constitutes acceptance of the updated Privacy Policy.
            </p>

            <h2 className="text-white">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
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

export default PrivacyPolicyPage;
