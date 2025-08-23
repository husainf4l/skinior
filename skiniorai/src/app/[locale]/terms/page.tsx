import { useTranslations } from "next-intl";

export default function TermsPage() {
  const t = useTranslations();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("footer.terms")}
      </h1>

      <div className="prose prose-lg max-w-none">
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            1. Terms of Service
          </h2>
          <p className="text-gray-700 mb-4">
            By using Skinior&apos;s services, you agree to be bound by these
            terms and conditions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            2. Use of Services
          </h2>
          <p className="text-gray-700 mb-4">
            You may use our skin analysis and product recommendation services
            for personal, non-commercial purposes only.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            3. User Responsibilities
          </h2>
          <p className="text-gray-700 mb-4">
            You are responsible for providing accurate information and
            maintaining the confidentiality of your account credentials.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            4. Disclaimer
          </h2>
          <p className="text-gray-700 mb-4">
            Our skin analysis and recommendations are for informational purposes
            only and do not constitute medical advice. Consult with healthcare
            professionals for medical concerns.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            5. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-4">
            Skinior shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            6. Changes to Terms
          </h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these terms at any time. Changes will
            be effective immediately upon posting.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            7. Contact Information
          </h2>
          <p className="text-gray-700">
            If you have any questions about these terms, please contact us
            through our website.
          </p>
        </section>
      </div>
    </div>
  );
}
