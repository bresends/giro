import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";

export function UserAvatar() {
  const viewer = useQuery(api.users.viewer);
  const [imageFailed, setImageFailed] = useState(false);

  if (!viewer) return null;

  const label = viewer.name ?? viewer.email ?? "Usuário";
  const initial = label.charAt(0).toUpperCase();

  return viewer.image && !imageFailed ? (
    <img
      src={viewer.image}
      alt={label}
      title={label}
      referrerPolicy="no-referrer"
      onError={() => setImageFailed(true)}
      className="w-9 h-9 rounded-full border object-cover shrink-0"
    />
  ) : (
    <div
      title={label}
      aria-label={label}
      className="w-9 h-9 rounded-full border bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold shrink-0"
    >
      {initial}
    </div>
  );
}
