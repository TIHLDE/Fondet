import Image from "next/image";
import { UserRound, Linkedin } from "lucide-react";
import type { Member } from "@/data/members";

export default function MemberCard({ member }: { member: Member }) {
  const hasImage =
    !!member.image &&
    (member.image.startsWith("http") || member.image.startsWith("/"));

  const years =
    member.endYear === member.startYear
      ? `${member.startYear}`
      : `${member.startYear} til ${member.endYear ?? "nå"}`;

  return (
    <div className="flex flex-col group">
      <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-secondary border border-cardBorder flex items-center justify-center mb-3 relative">
        {hasImage ? (
          <Image
            src={member.image}
            alt={member.name}
            width={300}
            height={400}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 200px"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <UserRound
            className="w-14 h-14 text-muted-foreground"
            aria-hidden
          />
        )}
      </div>

      <div className="flex items-start justify-between gap-2">
        <h2 className="text-foreground-primary font-semibold text-sm leading-snug">
          {member.name}
        </h2>
        {member.linkedin && (
          <a
            href={`https://linkedin.com/in/${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 -m-1 text-foreground-secondary hover:text-accent transition-colors"
            aria-label={`${member.name} på LinkedIn`}
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>

      <p className="text-foreground-secondary text-sm">{member.role}</p>
      <p className="text-muted-foreground text-xs mt-0.5">
        {member.studie} · {years}
      </p>
    </div>
  );
}
