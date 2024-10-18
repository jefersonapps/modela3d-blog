"use client";

import { getUser } from "@/app/http/get-user";
import { formatDateStringWithoutTime } from "@/app/utils/helpers";
import { useQuery } from "@tanstack/react-query";

interface UserInfoProps {
  fullName: string;
  emailAddress: string;
  imageUrl: string;
  createdAt: number;
  userId: string;
}

export function UserInfo({
  fullName,
  emailAddress,
  imageUrl,
  createdAt,
  userId,
}: UserInfoProps) {
  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser({ userId: userId }),
    enabled: !!userId,
    staleTime: Infinity,
  });

  const displayName =
    (userData ? userData[0]?.userName : undefined) ??
    fullName ??
    emailAddress ??
    "Anônimo";

  return (
    <div>
      <div className="h-36 bg-zinc-800"></div>

      <div className="relative -mt-12 flex items-center justify-between">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${displayName}`}
            className="w-24 h-24 rounded-full border-4 border-black ml-4"
          />
        )}
      </div>

      <div className="px-4 mt-2">
        <h2 className="text-xl font-bold">{`${displayName}`}</h2>
        <p className="text-zinc-500">{emailAddress}</p>
      </div>

      <div className="px-4 text-zinc-500 mt-2">
        <p>Entrou em {formatDateStringWithoutTime(new Date(createdAt))}</p>
      </div>
    </div>
  );
}
