import Image from "next/image";
import { stringToHash } from "@/lib/utils/string-to-hash";
import { cn } from "@/lib/utils/tailwind-merge";

const COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-orange-500",
  "bg-indigo-500",
  "bg-maroon-500",
];

export default function UserAvatar({ user }: UserAvatarProps) {
  // constants
  const identifier = user?.email || user?.firstName || "user";
  const colorIndex = stringToHash(identifier) % COLORS.length;
  const bgColor = COLORS[colorIndex];
  const firstLetter = user?.firstName?.charAt(0)?.toUpperCase() || "U";

  if (user?.photo && user.photo.trim() !== "") {
    return (
      <div className="w-9 h-9 rounded-full object-cover">
        <Image
          src={user.photo}
          alt={`${user.firstName} ${user.lastName} Avatar`}
          width={50}
          height={50}
          className="w-full rounded-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-9 h-9 text-white font-semibold",
        bgColor
      )}
    >
      {firstLetter}
    </div>
  );
}
