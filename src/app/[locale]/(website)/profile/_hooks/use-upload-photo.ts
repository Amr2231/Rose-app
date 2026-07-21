"use client";

import { useToast } from "@/hooks/use-toast";
import { uploadPhotoAction } from "@/lib/actions/account.actions";
import { useMutation } from "@tanstack/react-query";

export function useUploadPhoto() {
  const { toast } = useToast();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData: FormData) => await uploadPhotoAction(formData),
    onSuccess: () => {
      toast({
        title: "Your Photo Uploaded successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      console.error(err);
      toast({
        title: "Failed to upload your photo",
        variant: "destructive",
      });
    },
  });

  return { mutate, isPending };
}
