import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const sizeMap = { sm: 28, md: 36, lg: 48 };
  const px = sizeMap[size];
  const initials = name ? name.slice(0, 2).toUpperCase() : "??";

  return (
    <div
      className={cn(
        "rounded-full overflow-hidden flex items-center justify-center bg-surface-2 border border-border text-white font-bold shrink-0",
        {
          "text-xs": size === "sm",
          "text-sm": size === "md",
          "text-base": size === "lg",
        },
        className
      )}
      style={{ width: px, height: px }}
    >
      {src ? (
        <Image src={src} alt={name ?? "avatar"} width={px} height={px} className="object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
