import Link from "next/link";
import MemberCard from "../../components/MemberCard";
import GroupCarousel from "../../components/GroupCarousel";
import { getCurrentMembers, getGroupImage } from "@/data/members";
import { withImages, resolveGroupImages } from "@/lib/member-images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forvaltningsgruppen",
  description:
    "Møt Forvaltningsgruppen som forvalter TIHLDE Fondet.",
};

export default function Group() {
  const currentMembers = withImages(getCurrentMembers());
  const groupImages = resolveGroupImages(getGroupImage());

  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground-primary mb-2">
            Forvaltningsgruppen
          </h1>
          <p className="text-foreground-secondary">Nåværende medlemmer</p>
        </div>

        {groupImages.length > 0 && (
          <div className="w-full mb-6">
            <GroupCarousel images={groupImages} />
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
            href="/group/tidligere"
            className="block bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg hover:border-foreground-secondary transition-colors text-center"
          >
            <span className="text-foreground-secondary font-medium">
              Se tidligere medlemmer &rarr;
            </span>
          </Link>
        </div>

      </main>
    </div>
  );
}
