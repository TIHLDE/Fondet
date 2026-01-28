import Link from "next/link";
import ContactBox from "../../components/ContactBox";
import MemberCard from "../../components/MemberCard";
import { getCurrentMembers, getGroupImage } from "@/data/members";

export default function Group() {
  const currentMembers = getCurrentMembers();
  const groupImage = getGroupImage();

  return (
    <div className="min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Forvaltningsgruppen
          </h1>
          <p className="text-gray-400">Nåværende medlemmer</p>
        </div>

        {groupImage && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mb-6">
            <div className="bg-cardBackground border border-cardBorder rounded-lg overflow-hidden shadow-lg">
              <img
                src={groupImage}
                alt="Gruppebilde"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {currentMembers.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>

        {/* Link to previous members */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mb-6">
          <Link
            href="/gruppe/tidligere"
            className="block bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg hover:border-gray-500 transition-colors text-center"
          >
            <span className="text-gray-300 font-medium">
              Se tidligere medlemmer &rarr;
            </span>
          </Link>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0">
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
