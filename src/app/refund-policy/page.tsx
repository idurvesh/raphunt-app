export default function RefundCancellationPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter">Refund & Cancellation</h1>
        <p className="text-muted text-sm">Last updated: June 02, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
        <p className="text-white text-base">
          This Refund & Cancellation policy applies to payments made directly on RapHunt (raphunt.com) for event promotion and listing packages.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">1. Cancellation Policy</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Listing Cancellations:</strong> Event organizers cannot cancel or request deletion of a promotional listing package once the payment is completed and the event is published.
          </li>
          <li>
            <strong className="text-white">Draft Listing Cancellations:</strong> If you exit the checkout page prior to completing the payment flow, no charges are processed, and the draft listing will remain inactive.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">2. Refund Eligibility & Rules</h2>
        <p>
          Refunds are only eligible under the following specific circumstances:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Admin Rejection:</strong> If your event listing is submitted, paid for, and subsequently rejected by our administration team because it violates our community guidelines (e.g., hate speech, inappropriate content), a full refund of the listing fee will be processed.
          </li>
          <li>
            <strong className="text-white">Duplicate Payments:</strong> In the event of a technical issue leading to a double-charge for a single listing package, the duplicate payment will be refunded in full.
          </li>
          <li>
            <strong className="text-white">Failed Deliveries:</strong> If a paid listing fails to go live within 48 hours of payment verification due to website technical errors.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">3. Refund Processing Timelines</h2>
        <p>
          Once a refund is approved by our support team:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>The refund request is initiated within 24-48 hours.</li>
          <li>The amount will be credited back to your original source of payment (UPI, Credit/Debit Card, Net Banking) through our payment gateway provider.</li>
          <li>It typically takes <strong className="text-white">5 to 7 business days</strong> for the refund to reflect in your bank account, depending on your bank&apos;s processing times.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">4. Ticketing Disclaimer (Important)</h2>
        <div className="bg-surface p-5 rounded-2xl border border-border space-y-3">
          <p className="text-white font-semibold">External Event Tickets:</p>
          <p className="text-sm">
            RapHunt only hosts promotional listings and redirect links to third-party booking sites (like BookMyShow, Paytm Insider, etc.). We do not sell event entry tickets directly.
          </p>
          <p className="text-sm font-medium text-accent">
            Any refund or cancellation requests regarding event entry tickets, artist show cancellations, or venue issues must be directed to the respective organizers and ticketing platforms. RapHunt is not liable for ticket sale transactions.
          </p>
        </div>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">5. Requesting a Refund</h2>
        <p>
          To request a refund for a listing issue, please contact us at:
        </p>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-white font-medium">RapHunt Payments Desk</p>
          <p>Email: <a href="mailto:billing@raphunt.com" className="text-accent hover:underline">billing@raphunt.com</a> (cc: <a href="mailto:support@raphunt.com" className="text-accent hover:underline">support@raphunt.com</a>)</p>
          <p>Provide your order ID, email address, transaction reference, and the link to your listed event.</p>
        </div>
      </div>
    </div>
  );
}
