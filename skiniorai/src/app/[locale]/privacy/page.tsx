import { useTranslations } from "next-intl";

export default function PrivacyPage() {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("footer.privacy")}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-gray-700 mb-4">
            We collect information you provide directly to us, such as when you
            create an account, use our skin analysis service, or contact us for
            support.
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Personal information (name, email, phone number)</li>
            <li>Skin analysis photos and data</li>
            <li>Usage information and preferences</li>
            <li>Device and browser information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We use the information we collect to:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Provide and improve our skin analysis services</li>
            <li>Send you personalized product recommendations</li>
            <li>Communicate with you about our services</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. Information Sharing
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Your Rights
          </h2>
          <p className="text-gray-700 mb-4">
            You have the right to access, update, or delete your personal
            information. You may also opt out of certain communications from us.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar tracking technologies to enhance your
            experience and analyze how our services are used.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-gray-700 mb-4">
            Our services are not intended for children under 13. We do not
            knowingly collect personal information from children under 13.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            8. Changes to This Policy
          </h2>
          <p className="text-gray-700 mb-4">
            We may update this privacy policy from time to time. We will notify
            you of any changes by posting the new policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            9. Contact Us
          </h2>
          <p className="text-gray-700">
            If you have any questions about this privacy policy, please contact
            us through our website or support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
