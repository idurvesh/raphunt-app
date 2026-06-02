declare module "@cashfreepayments/cashfree-js" {
  interface CashfreeCheckoutOptions {
    paymentSessionId: string;
    redirectTarget: "_self" | "_blank" | "_modal";
  }

  interface CashfreeInstance {
    checkout(options: CashfreeCheckoutOptions): Promise<void>;
  }

  interface CashfreeLoadOptions {
    mode: "sandbox" | "production";
  }

  export function load(options: CashfreeLoadOptions): Promise<CashfreeInstance>;
}
