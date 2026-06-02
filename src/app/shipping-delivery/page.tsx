export default function ShippingDeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-20 space-y-10">
      <div className="space-y-4">
        <h1 className="text-4xl font-black tracking-tighter">Shipping & Delivery</h1>
        <p className="text-muted text-sm">Last updated: June 02, 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted space-y-6 text-sm leading-relaxed">
        <p className="text-white text-base font-medium">
          RapHunt provides online event listing and promotion services. All transactions on our platform are for virtual digital services. No physical products are shipped or delivered.
        </p>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">1. Digital Delivery Process</h2>
        <p>
          Since we sell only digital promotion listing spaces and event highlights:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-white">Instant Order Creation:</strong> When you pay for a listing tier (Basic, Premium, or Featured), our backend system processes the receipt and updates your transaction ledger instantly.
          </li>
          <li>
            <strong className="text-white">Service Activation:</strong> Once the payment is verified, your event is automatically activated and becomes visible in the events feed.
          </li>
          <li>
            <strong className="text-white">Admin Moderation:</strong> In cases where manual moderation is active, your listing will undergo review and go live within <span className="text-white font-semibold">2 to 24 hours</span>. You will receive an email notification when it is published.
          </li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">2. Shipping Charges & Delivery Locations</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>There are <strong className="text-white">zero shipping charges</strong>, delivery fees, or handling fees associated with any listing on RapHunt.</li>
          <li>Our digital platform is accessible globally. Service activation occurs electronically through the user account and dashboard.</li>
        </ul>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">3. Transaction Confirmation</h2>
        <p>
          Upon successful payment completion, you will receive:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>An on-screen confirmation with your order and transaction references.</li>
          <li>An automated transaction invoice email sent to your registered email address, confirming details of the listing tier.</li>
          <li>Immediate update to your organizer profile showing the paid listing status.</li>
        </ol>

        <h2 className="text-xl font-bold text-white pt-4 border-t border-border">4. Contact Information</h2>
        <p>
          If you encounter any delays in activation or have questions about delivery status, please contact us:
        </p>
        <div className="bg-surface p-4 rounded-xl border border-border">
          <p className="text-white font-medium">RapHunt Operations Support</p>
          {process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
            <p>Email: <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`} className="text-accent hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a></p>
          )}
          {process.env.NEXT_PUBLIC_SUPPORT_PHONE && (
            <p>Phone: {process.env.NEXT_PUBLIC_SUPPORT_PHONE}</p>
          )}
        </div>
      </div>
    </div>
  );
}
