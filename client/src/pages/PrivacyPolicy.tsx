import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      {/* Hero */}
      <section className="bg-[#0D1B2A] py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Privacy Policy
          </h1>
          <p className="text-[#8B9EB7] text-lg">
            How Sponsor ComplIANS collects, uses, and protects your personal data.
          </p>
          <p className="text-[#8B9EB7] text-sm mt-2">Last updated: 19 March 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 md:p-12 space-y-8 text-[#374151] leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>1. Who We Are</h2>
            <p>
              Sponsor ComplIANS ("we", "us", "our") provides sponsor licence compliance, recruitment, and HR services to UK employers. We are committed to protecting your privacy and complying with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
            </p>
            <p className="mt-2">
              <strong>Data Controller:</strong> Sponsor ComplIANS<br />
              <strong>Email:</strong> <a href="mailto:admin@sponsorcomplians.com" className="text-[#00C3FF] hover:underline">admin@sponsorcomplians.com</a><br />
              <strong>Phone:</strong> 020 3618 6968
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>2. Information We Collect</h2>
            <p>We may collect the following categories of personal data:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Identity Data:</strong> First name, last name, job title, company name.</li>
              <li><strong>Contact Data:</strong> Email address, telephone number, postal address.</li>
              <li><strong>Technical Data:</strong> IP address, browser type, operating system, pages visited, session identifiers, and cookies.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website and services.</li>
              <li><strong>Communications Data:</strong> Messages sent through our contact forms, chatbot conversations, and email correspondence.</li>
              <li><strong>Application Data:</strong> CVs, employment history, qualifications, references, and other information submitted through job applications.</li>
              <li><strong>Registration Data:</strong> Information provided when registering for webinars, events, or our newsletter.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>3. How We Collect Your Data</h2>
            <p>We collect personal data through:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Contact forms and enquiry submissions on our website.</li>
              <li>Newsletter and event registration forms.</li>
              <li>Job application forms.</li>
              <li>Our IANS chatbot conversations.</li>
              <li>Cookies and similar tracking technologies.</li>
              <li>Direct email or telephone communications.</li>
              <li>Third-party referrals and business introductions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>4. Legal Basis for Processing</h2>
            <p>We process your personal data under the following lawful bases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Consent:</strong> Where you have given clear consent for us to process your data for a specific purpose (e.g., newsletter subscriptions, non-essential cookies).</li>
              <li><strong>Contract:</strong> Where processing is necessary for the performance of a contract with you or to take steps at your request before entering into a contract.</li>
              <li><strong>Legitimate Interests:</strong> Where processing is necessary for our legitimate business interests, such as improving our services, marketing, and website analytics, provided these interests are not overridden by your rights.</li>
              <li><strong>Legal Obligation:</strong> Where processing is necessary to comply with a legal obligation, such as regulatory requirements related to sponsor licence compliance.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>5. How We Use Your Data</h2>
            <p>We use your personal data to:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Respond to your enquiries and provide requested services.</li>
              <li>Process job applications and manage recruitment activities.</li>
              <li>Send newsletters, event invitations, and marketing communications (with your consent).</li>
              <li>Provide compliance audit services and sponsor licence support.</li>
              <li>Improve our website, services, and user experience.</li>
              <li>Analyse website traffic and usage patterns.</li>
              <li>Comply with legal and regulatory obligations.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>6. Cookies</h2>
            <p>
              Our website uses cookies and similar technologies. We categorise cookies as:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly. These cannot be disabled.</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website. These require your consent.</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements. These require your consent.</li>
            </ul>
            <p className="mt-2">
              You can manage your cookie preferences at any time using the cookie banner displayed on your first visit, or by adjusting your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>7. Data Sharing</h2>
            <p>We may share your personal data with:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> Third-party companies that help us deliver our services (e.g., hosting providers, email services, analytics platforms). These providers are contractually bound to protect your data.</li>
              <li><strong>Regulatory Bodies:</strong> Where required by law or to comply with regulatory obligations (e.g., the Home Office in relation to sponsor licence matters).</li>
              <li><strong>Professional Advisors:</strong> Lawyers, accountants, and other professional advisors as necessary.</li>
            </ul>
            <p className="mt-2">We do not sell your personal data to third parties.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>8. Data Retention</h2>
            <p>
              We retain your personal data only for as long as necessary to fulfil the purposes for which it was collected, or as required by law. Specific retention periods include:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Contact form submissions:</strong> 3 years from the date of submission.</li>
              <li><strong>Job applications:</strong> 12 months from the date of application (unless you consent to longer retention).</li>
              <li><strong>Newsletter subscriptions:</strong> Until you unsubscribe.</li>
              <li><strong>Website analytics data:</strong> 26 months.</li>
              <li><strong>Compliance audit records:</strong> 6 years in line with regulatory requirements.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>9. Your Rights</h2>
            <p>Under the UK GDPR, you have the following rights:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal exceptions).</li>
              <li><strong>Right to Restrict Processing:</strong> Request that we limit how we use your data.</li>
              <li><strong>Right to Data Portability:</strong> Request transfer of your data to another organisation.</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at <a href="mailto:admin@sponsorcomplians.com" className="text-[#00C3FF] hover:underline">admin@sponsorcomplians.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>10. International Transfers</h2>
            <p>
              Your data may be processed outside the UK where our service providers are located. Where this occurs, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses approved by the ICO, to protect your data.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>11. Data Security</h2>
            <p>
              We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include encryption, secure hosting, access controls, and regular security reviews.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>12. Complaints</h2>
            <p>
              If you are not satisfied with how we handle your personal data, you have the right to lodge a complaint with the Information Commissioner's Office (ICO):
            </p>
            <p className="mt-2">
              <strong>Website:</strong> <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#00C3FF] hover:underline">ico.org.uk</a><br />
              <strong>Helpline:</strong> 0303 123 1113
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1F2937] mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last updated" date. We encourage you to review this policy periodically.
            </p>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <p className="text-sm text-[#9CA3AF]">
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
