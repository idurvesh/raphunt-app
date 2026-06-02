export default function TermsConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter">Terms & Conditions</h1>
        <p className="text-muted text-sm">Last updated: June 02, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
        <p className="text-white text-base">
          Welcome to RapHunt. These Terms and Conditions outline the rules and regulations for the use of RapHunt&apos;s Website, located at raphunt.com.
        </p>
        <p>
          By accessing this website, we assume you accept these terms and conditions. Do not continue to use RapHunt if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">1. Definitions</h2>
        <p>
          Throughout these Terms, &quot;Platform&quot;, &quot;RapHunt&quot;, &quot;We&quot;, &quot;Our&quot;, and &quot;Us&quot; refers to the owner of this website. &quot;User&quot;, &quot;You&quot;, &quot;Artist&quot;, &quot;Organizer&quot;, and &quot;Visitor&quot; refers to you, the person accessing this website and accepting these terms.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">2. Account Creation & Verification</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>To access certain features (such as listing drops, events, writing reviews, and commenting), you must register for an account.</li>
          <li>You agree to provide accurate, current, and complete registration information.</li>
          <li>We reserve the right to suspend or terminate accounts that provide false information or violate our guidelines.</li>
          <li>Artists can apply for verification badges. Verification is at the sole discretion of our team based on social links and profile integrity.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">3. Event Listings & Promotion Fees</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>RapHunt offers various promotion and event listing tiers (Basic, Premium, Featured) for organizers to list hip-hop events.</li>
          <li>Fees are charged on a one-time basis per event listing, as per the rates displayed at the time of checkout.</li>
          <li>Payments are collected securely via our integrated third-party payment gateways. You agree to pay all charges incurred under your account.</li>
          <li>Listing packages and features are subject to change, and we will update pricing information directly on the checkout screens.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">4. User Guidelines & Prohibited Content</h2>
        <p>
          When submitting events, artist tracks, news, reviews, or comments, you agree not to submit material that:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Is illegal, threatening, defamatory, or violates the intellectual property rights of any third party.</li>
          <li>Promotes hate speech, violence, harassment, or illegal substances.</li>
          <li>Contains malware, phishing links, or acts as commercial spam.</li>
          <li>Impersonates other artists, organizers, or entities.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">5. Intellectual Property Rights</h2>
        <p>
          Unless otherwise stated, RapHunt and/or its licensors own the intellectual property rights for all material on RapHunt. All intellectual property rights are reserved. You may access this from RapHunt for your own personal use subjected to restrictions set in these terms and conditions.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, in no event shall RapHunt or its operators be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with the use of the platform, the postponement/cancellation of listed events, or transaction disputes between event ticketholders and organizers.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">7. Governing Law and Jurisdiction</h2>
        <p>
          These Terms and Conditions will be governed by and construed in accordance with the laws of India. Any disputes relating to these terms will be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">8. Contact Us</h2>
        <p>
          For any clarifications regarding our Terms and Conditions, please email us at {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ? <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-accent hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a> : "our support team"}.
        </p>
      </div>
    </div>
  );
}
