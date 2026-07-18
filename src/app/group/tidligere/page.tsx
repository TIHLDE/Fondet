import Link from "next/link";
import PaginatedMemberGrid from "../../../components/PaginatedMemberGrid";
import GroupCarousel from "../../../components/GroupCarousel";
import { getPreviousMembers } from "@/data/members";
import { withImages, resolveArchiveGroupImages } from "@/lib/member-images";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tidligere medlemmer",
  description:
    "Tidligere medlemmer av Forvaltningsgruppen i TIHLDE Fondet.",
};

export default function PreviousMembers() {
  const previousMembers = withImages(getPreviousMembers());
  const archive = resolveArchiveGroupImages();

  return (
    <div className="w-full min-h-screen bg-gradient-primary">
      <main className="flex flex-col items-center justify-center sm:px-8 sm:pb-8 pt-24">
        <div className="text-center mb-8 px-4 sm:px-0 pt-8 sm:pt-8">
          <h1 className="text-4xl font-bold text-foreground-primary mb-2">
            Tidligere medlemmer
          </h1>
          <Link
            href="/group"
            className="text-foreground-secondary hover:text-foreground-primary transition-colors"
          >
            &larr; Tilbake til nåværende medlemmer
          </Link>
        </div>

        {archive.length > 0 && (
          <div className="w-full max-w-6xl mx-auto sm:px-0 mb-10">
            <GroupCarousel
              images={archive.map((a) => a.src)}
              captions={archive.map((a) => a.year)}
              aspect="landscape"
              label="Gruppebilder fra tidligere år"
            />
          </div>
        )}

        <div className="w-full max-w-6xl mx-auto px-4 sm:px-0 mb-6">
          <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 sm:p-8 shadow-lg">
            <PaginatedMemberGrid members={previousMembers} filterable />
          </div>
        </div>

      </main>
    </div>
  );
}
