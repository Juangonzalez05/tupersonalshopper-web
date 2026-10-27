import type { Metadata } from "next";
import { QuoteSent } from "@/features/quote/quote-sent";

export const metadata: Metadata = {
  title: "Solicitud lista",
  robots: { index: false, follow: false },
};

export default function QuoteSentPage() {
  return (
    <div className="wrap pb-10">
      <QuoteSent />
    </div>
  );
}
