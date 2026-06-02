export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter">Privacy Policy</h1>
        <p className="text-muted text-sm">Last updated: June 02, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
        <p className="text-white text-base">
          At RapHunt, accessible from raphunt.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by RapHunt and how we use it.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">1. Information We Collect</h2>
        <p>
          We collect information in the following ways to provide better services to all our users:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Account Information:</strong> When you register for an account (fan, artist, writer), we may ask for your contact information, including items such as name, username, email address, and avatar.
          </li>
          <li>
            <strong className="text-white">Event and Listing Details:</strong> If you organize events or list drops on RapHunt, we collect the details you provide, including dates, locations, artist lineups, media URLs, ticket links, and associated billing details.
          </li>
          <li>
            <strong className="text-white">Payment Information:</strong> When you purchase promotion tiers or list paid events, transaction details are processed securely via our RBI-authorized third-party payment gateways (e.g., PhonePe / Cashfree). We do not store credit card numbers, CVVs, or payment passwords directly on our servers.
          </li>
          <li>
            <strong className="text-white">User Contributions:</strong> We collect details of your upvotes, comments, and reviews left on the platform.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">2. How We Use Your Information</h2>
        <p>
          We use the information we collect in various ways, including to:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Provide, operate, and maintain our website and platform operations.</li>
          <li>Improve, personalize, and expand our website features and user experience.</li>
          <li>Understand and analyze how you use our website.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes.</li>
          <li>Process your payments, listing activations, and provide invoicing.</li>
          <li>Find and prevent fraud, spam, or security issues.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">3. Cookies and Tracking Technologies</h2>
        <p>
          RapHunt uses cookies to store information about visitors&apos; preferences, user sessions, and pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing our web page content based on visitors&apos; browser type and/or other information.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">4. Data Sharing and Third-Party Services</h2>
        <p>
          We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential (such as Supabase for database hosting, and our payment gateways for processing listings).
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">5. Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information when you enter, submit, or access your personal information. Database access is strictly controlled, and transit operations are encrypted using standard Secure Socket Layer (SSL/HTTPS) technology.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">6. Your Data Rights</h2>
        <p>
          You have the right to request access to, correction of, or deletion of the personal data we hold about you. You can update your profile information in your account settings or contact our support team at {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ? <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-accent hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a> : "our support team"} to request account erasure.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">7. Contact Information</h2>
        <p>
          If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at:
        </p>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-white font-medium">RapHunt Operations</p>
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
            <p>Email: <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-accent hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a></p>
          )}
          {process.env.NEXT_PUBLIC_SUPPORT_ADDRESS && (
            <p className="whitespace-pre-line">Address: {process.env.NEXT_PUBLIC_SUPPORT_ADDRESS}</p>
          )}
        </div>
      </div>
    </div>
  );
}
