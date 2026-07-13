import Link from "next/link";
import ContactBox from "../../components/ContactBox";
import MemberCard from "../../components/MemberCard";
import { getCurrentMembers, getGroupImage } from "@/data/members";

export default function Group() {
  const currentMembers = getCurrentMembers();
  const groupImage = getGroupImage();

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div className="absolute left-0 right-0 top-0 bottom-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{
            background: 'linear-gradient(90deg, rgba(30,64,175,0.2) 0%, rgba(59,130,246,0.3) 50%, rgba(96,165,250,0.2) 100%)'
          }}
        />
      </div>

      <main className="flex flex-col items-center justify-center relative z-10">
        {/* Title section with wave */}
        <div style={{ marginBottom: '32px', width: '100%' }}>
          <div style={{ paddingTop: '64px', paddingBottom: '16px', background: '#000000', overflowWrap: 'break-word' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
              <h1 className="text-4xl font-bold text-white" style={{ marginLeft: '20px' }}>Forvaltningsgruppen</h1>
              <p className="text-gray-400 mt-2" style={{ marginLeft: '20px' }}>Nåværende medlemmer</p>
            </div>
          </div>
          <svg viewBox="0 1.4 20 1.2" width="100%" height="80" preserveAspectRatio="none">
            <path fill="#000000" d="M 0 2 C 10 4 10 0 20 2 L 20 0 L 0 0 Z"></path>
          </svg>
        </div>

        {groupImage && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 mb-6">
            <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm overflow-hidden shadow-lg">
              <img
                src={groupImage}
                alt="Gruppebilde"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 mb-6">
          <div className="rounded-xl border border-white/10 bg-slate-900/30 backdrop-blur-sm p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {currentMembers.map((member) => (
                <MemberCard key={member.name} member={member} />
              ))}
            </div>
          </div>
        </div>

        {/* Link to previous members */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 mb-6">
          <Link
            href="/group/tidligere"
            className="block bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg hover:border-gray-500 transition-colors text-center"
          >
            <span className="text-gray-300 font-medium">
              Se tidligere medlemmer &rarr;
            </span>
          </Link>
        </div>

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8">
          <ContactBox />
        </div>
      </main>
    </div>
  );
}
