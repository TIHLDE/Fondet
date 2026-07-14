import SoknadSkjema from "../../../components/SoknadSkjema";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Søknadsskjema",
};

export default function SkjemaPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground-primary mb-8">
            Søknadsskjema
          </h1>
        </div>

        <div className="w-full max-w-6xl mx-auto px-0 sm:px-0 mb-6">
          <SoknadSkjema />
        </div>
      </main>
    </div>
  );
}
