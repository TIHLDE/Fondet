"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import type { NordnetData } from "@/lib/nordnet-types";

const NORDNET_PROFILE_URL =
  "https://www.nordnet.no/aksjeforum/medlemmer/tihlde-forvaltningsgruppen";

export function useNordnet() {
  return useQuery<NordnetData>({
    queryKey: ["nordnet"],
    queryFn: () => fetch("/api/nordnet").then((r) => r.json()),
    staleTime: 1000 * 60 * 30,
  });
}

export default function NordnetProfileCard() {
  const { data, isLoading } = useNordnet();

  if (isLoading) {
    return (
      <div className="h-24 rounded-lg bg-cardBackground border border-cardBorder animate-pulse" />
    );
  }

  const profile = data?.profile;
  if (!profile) return null;

  const joinedYear = new Date(profile.joinedAt).getFullYear();

  return (
    <div className="bg-cardBackground border border-cardBorder rounded-lg p-6 shadow-lg">
      <div className="flex flex-wrap items-center gap-4">
        {profile.avatarUri && (
          <Image
            src={profile.avatarUri}
            alt=""
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border border-cardBorder"
          />
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-semibold text-foreground-primary truncate">
            {profile.username}
          </h2>
          <p className="text-sm text-foreground-secondary">
            På Nordnet siden {joinedYear}
          </p>
        </div>
        <div className="flex items-center gap-6">
          <a
            href={NORDNET_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline py-3"
          >
            Se på Nordnet
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
