"use client";

import { useRef, useState, useTransition, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Camera, X } from "lucide-react";

import AvatarCompletionRing from "@/components/profile/AvatarCompletionRing";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { getCroppedImageBlob } from "@/lib/image-crop";
import { uploadProfilePhoto } from "@/actions/profile";

const MAX_FILE_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface AvatarUploadProps {
  profileImage: string | null;
  name: string;
  email: string;
  ringPercent: number;
}

// The avatar upload/crop flow is deliberately its own self-contained widget,
// separate from the big "Save Changes" profile form — a new photo should
// take effect immediately, not wait on (or get bundled with) unrelated
// field edits.
export default function AvatarUpload({ profileImage, name, email, ringPercent }: AvatarUploadProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isUploading, startUpload] = useTransition();

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Profile picture must be a JPEG, PNG, or WEBP image");
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      toast.error("Profile picture must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result as string);
    reader.readAsDataURL(file);
  }

  function closeModal() {
    setImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);
  }

  function handleSave() {
    if (!imageSrc || !croppedAreaPixels) return;

    startUpload(async () => {
      try {
        const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
        const formData = new FormData();
        formData.append("profileImage", blob, "profile-photo.jpg");

        const result = await uploadProfilePhoto(undefined, formData);
        if (result?.success) {
          toast.success(result.message ?? "Profile photo updated.");
          closeModal();
          router.refresh();
        } else {
          toast.error(result?.message ?? "Could not update profile photo.");
        }
      } catch {
        toast.error("Could not process that image. Please try a different photo.");
      }
    });
  }

  return (
    <>
      <div className="relative shrink-0">
        <AvatarCompletionRing percent={ringPercent} size={92} strokeWidth={4}>
          <div className="flex items-center justify-center w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-[#2563EB] to-[#60A5FA] text-white text-2xl font-bold shrink-0">
            <Avatar src={profileImage} name={name} email={email} className="w-full h-full object-cover" />
          </div>
        </AvatarCompletionRing>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          aria-label="Upload profile photo"
          className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md ring-2 ring-white transition-colors hover:bg-[#1D4ED8]"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {imageSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#0F172A]">Adjust your photo</h3>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Cancel"
                disabled={isUploading}
                className="text-[#94A3B8] transition-colors hover:text-[#0F172A] disabled:opacity-50"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="relative h-72 w-full overflow-hidden rounded-xl bg-slate-100">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, areaPixels) => setCroppedAreaPixels(areaPixels)}
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs font-medium text-[#64748B]">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                disabled={isUploading}
                className="flex-1 accent-[#2563EB]"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={closeModal} disabled={isUploading}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSave} loading={isUploading} disabled={isUploading}>
                Save Photo
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
