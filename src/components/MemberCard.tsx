import Image from "next/image";
import { UserRound, Linkedin } from "lucide-react";
import type { Member } from "@/data/members";

export default function MemberCard({ member }: { member: Member }) {
  const hasImage = member.image && member.image.startsWith("http");

  return (
    <div className="flex flex-col">
      {/* Portrait image */}
      <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-secondary border border-cardBorder flex items-center justify-center mb-3 relative">
        {hasImage ? (
          <Image
            src={member.image}
            alt={member.name}
            width={300}
            height={400}
            className="w-full h-full object-cover"
          />
        ) : (
          <UserRound className="w-16 h-16 text-gray-500" />
        )}
      </div>

      {/* Name */}
      <h3 className="text-white font-semibold text-sm leading-tight truncate">
        {member.name}
      </h3>

      {/* Role */}
      <p className="text-gray-400 text-sm truncate">
        {member.role}
      </p>

      {/* LinkedIn icon */}
      {member.linkedin && (
        <div className="mt-1.5">
          <a
            href={`https://linkedin.com/in/${member.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-gray-400 hover:text-blue-400 transition-colors"
            aria-label={`${member.name} LinkedIn`}
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      )}
    </div>
  );
}
