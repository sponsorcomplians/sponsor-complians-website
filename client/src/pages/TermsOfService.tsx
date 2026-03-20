import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero */}
      <section className="bg-[#0D1B2A] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Terms of Service
          </h1>
          <p className="text-[#8B9EB7] text-lg">
            Terms and conditions governing the use of the Sponsor ComplIANS website and services.
          </p>
          <p className="text-[#8B9EB7] text-sm mt-2">Last updated: 19 March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 md:p-12 space-y-8 text-[#374151] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>1. Introduction</h2>
            <p>
              These Terms of Service ("Terms") govern your access to and use of the Sponsor ComplIANS website at <a href="https://www.sponsorcomplians.com" className="text-[#00C3FF] hover:underline">www.sponsorcomplians.com</a> and any related services provided by Sponsor ComplIANS ("we", "us", "our").
            </p>
            <p className="mt-2">
              By accessing or using our website and services, you agree to be bound by these Terms. If you do not agree, please do not use our website or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>2. Services</h2>
            <p>Sponsor ComplIANS provides the following services to UK employers:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Sponsor Licence Compliance Audits:</strong> Comprehensive reviews of sponsor licence obligations, documentation, and Home Office compliance.</li>
              <li><strong>Skilled Worker Recruitment:</strong> End-to-end recruitment solutions for employers seeking to hire skilled workers under the UK immigration system.</li>
              <li><strong>HR Services:</strong> Sponsor-ready HR policies, right-to-work checks, and ongoing compliance support.</li>
              <li><strong>Compliance Hub Software:</strong> Digital tools for managing sponsor licence obligations.</li>
              <li><strong>Training and Events:</strong> Webinars, workshops, and educational resources on sponsor licence compliance.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>3. Eligibility</h2>
            <p>
              Our services are designed for UK-based employers and organisations that hold or are applying for a UK sponsor licence. By using our services, you represent that you are at least 18 years of age and have the legal authority to enter into these Terms on behalf of yourself or your organisation.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>4. User Accounts</h2>
            <p>
              Certain features of our website may require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorised use of your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Use our website or services for any unlawful purpose.</li>
              <li>Attempt to gain unauthorised access to any part of our website, servers, or databases.</li>
              <li>Transmit any viruses, malware, or other harmful code.</li>
              <li>Scrape, crawl, or use automated tools to extract data from our website without our written consent.</li>
              <li>Impersonate any person or entity, or misrepresent your affiliation with any person or entity.</li>
              <li>Interfere with or disrupt the operation of our website or services.</li>
              <li>Post or transmit any content that is defamatory, obscene, or otherwise objectionable.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>6. Intellectual Property</h2>
            <p>
              All content on our website, including text, graphics, logos, images, software, and other materials, is the property of Sponsor ComplIANS or its licensors and is protected by UK and international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="mt-2">
              You may not reproduce, distribute, modify, create derivative works from, publicly display, or otherwise exploit any content from our website without our prior written consent.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>7. Job Listings and Applications</h2>
            <p>
              Our jobs board allows employers to post vacancies and candidates to apply for positions. We act as an intermediary and do not guarantee the accuracy of job listings or the suitability of candidates. Employers are responsible for ensuring their job listings comply with all applicable laws, including the Equality Act 2010 and UK immigration regulations.
            </p>
            <p className="mt-2">
              Job applications submitted through our platform are processed in accordance with our <Link href="/privacy-policy" className="text-[#00C3FF] hover:underline">Privacy Policy</Link>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>8. Chatbot (IANS)</h2>
            <p>
              Our website features an AI-powered chatbot called IANS that provides general information about our services and sponsor licence compliance. The information provided by IANS is for general guidance only and does not constitute legal advice. You should not rely solely on chatbot responses for making compliance decisions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>9. Fees and Payment</h2>
            <p>
              Certain services, including premium job listings and compliance audit packages, may require payment. All fees are quoted in British Pounds (GBP) and are exclusive of VAT unless otherwise stated. Payment terms will be specified in the relevant service agreement or at the point of purchase.
            </p>
            <p className="mt-2">
              We use Stripe as our payment processor. By making a payment, you agree to Stripe's terms of service and privacy policy.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>10. Disclaimer of Warranties</h2>
            <p>
              Our website and services are provided on an "as is" and "as available" basis. While we strive to ensure the accuracy and reliability of the information on our website, we make no warranties or representations, express or implied, regarding:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>The completeness, accuracy, or timeliness of any content.</li>
              <li>The availability or uninterrupted operation of our website.</li>
              <li>The suitability of our services for your particular needs.</li>
            </ul>
            <p className="mt-2">
              Information on our website does not constitute legal advice. For specific compliance guidance, please consult with our team directly.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>11. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Sponsor ComplIANS shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of our website or services, including but not limited to loss of profits, data, or business opportunities.
            </p>
            <p className="mt-2">
              Our total liability for any claim arising out of or in connection with these Terms shall not exceed the amount paid by you to us in the 12 months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>12. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Sponsor ComplIANS, its directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising out of your breach of these Terms or your use of our website or services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>13. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the content, privacy practices, or availability of these external sites. Accessing third-party links is at your own risk.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>14. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to our website and services at any time, without notice, for any reason, including breach of these Terms. Upon termination, your right to use our website and services will immediately cease.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>15. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of England and Wales. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>16. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Any changes will be posted on this page with an updated "Last updated" date. Your continued use of our website after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#9CA3AF]">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:admin@sponsorcomplians.com" className="text-[#00C3FF] hover:underline">admin@sponsorcomplians.com</a>{" "}
              or call 020 3618 6968.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[#00C3FF] hover:underline font-medium">
            &larr; Back to Homepage
          </Link>
        </div>
      </section>
    </div>
  );
}
