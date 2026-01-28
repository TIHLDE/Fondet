import Link from "next/link";
import ContactBox from "../../../components/ContactBox";
import MemberCard from "../../../components/MemberCard";
import { getPreviousMembers } from "@/data/members";

export default function PreviousMembers() {
  const previousMembers = getPreviousMembers();

  return (
    <div className="min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Tidligere medlemmer
          </h1>
          <Link
            href="/gruppe"
            className="text-gray-400 hover:text-white transition-colors"
          >
            &larr; Tilbake til nåværende medlemmer
          </Link>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {previousMembers.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
