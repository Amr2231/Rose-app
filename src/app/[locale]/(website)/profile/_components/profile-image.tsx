"use client";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { useUploadPhoto } from "../_hooks/use-upload-photo";

type ProfileImageProps = {
  userPhoto?: string;
};
export default function ProfileImage({ userPhoto }: ProfileImageProps) {
  //Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  //States
  const [preview, setPreview] = useState<string | null>(null);

  //Mutations
  const { mutate } = useUploadPhoto();

  //Functions
  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (preview) URL.revokeObjectURL(preview);

    // Show preview
    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);

    // New backend's POST /api/upload expects the multipart field to be
    // named "image", not "photo".
    const formData = new FormData();
    formData.append("image", file);
    mutate(formData);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="relative">
      <Image
        className="w-[7.5rem] h-[7.5rem] border rounded-full "
        src={preview || userPhoto || "/images/default-avatar.svg"}
        width={50}
        height={50}
        sizes="150"
        alt="photo"
      />
      <CloudUpload
        onClick={handleIconClick}
        size={20}
        className="absolute w-8 h-8  right-2 bottom-2 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-full p-1 cursor-pointer"
      />
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
