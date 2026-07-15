"use client";

import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { cn } from "@/lib/utils/tailwind-merge";
import { useFormatter } from "next-intl";

export default function TestimonialCard({
  _id,
  name,
  image,
  rating,
  content,
  updatedAt,
}: TestimonialProps) {
  const format = useFormatter();

  return (
    <Card
      key={_id}
      className="w-full max-w-[404px] h-[433px] bg-transparent pb-10 border-none shadow-none flex items-end justify-center"
    >
      <CardContent className="w-full max-w-[343px] h-64 bg-white dark:bg-zinc-800 mx-auto rounded-3xl flex flex-col items-center justify-between px-5 pt-16 pb-0 gap-7 relative">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={128}
            height={128}
            sizes="128px"
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 w-32 h-32 rounded-full object-cover border-4 border-white dark:border-zinc-800"
          />
        ) : (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-20 w-32 h-32 rounded-full bg-maroon-100 border-4 border-white dark:border-zinc-800 flex items-center justify-center text-2xl font-semibold text-maroon-600">
            {name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
        )}

        <CardTitle className="font-semibold text-center dark:text-zinc-50">
          {name}
        </CardTitle>

        <CardDescription className="text-zinc-800 dark:text-zinc-200 font-medium h-32 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={cn(
                  "h-4 w-4",
                  index < rating
                    ? "fill-[#fba707] text-[#fba707]"
                    : "text-[#fba707]",
                )}
              />
            ))}
          </div>
          <p className="h-12 text-center line-clamp-3">{content}</p>
        </CardDescription>

        <CardFooter className="text-zinc-400 text-xs mt-5">
          {format.dateTime(new Date(updatedAt), { dateStyle: "long" })}
        </CardFooter>
      </CardContent>
    </Card>
  );
}
