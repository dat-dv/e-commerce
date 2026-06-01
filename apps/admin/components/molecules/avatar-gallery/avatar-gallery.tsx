import Image from "next/image";

export interface IAvatarGalleryProps {
  avatars: {
    id: string;
    url: string;
    isCurrent?: boolean;
  }[];
  selectedAvatarId: string;
  onSelectAvatar: (id: string) => void;
}

export const AvatarGallery = ({
  avatars,
  selectedAvatarId,
  onSelectAvatar,
}: IAvatarGalleryProps) => {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
      {avatars.length > 0 ? (
        avatars.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelectAvatar(avatar.id)}
            className={`group relative aspect-square overflow-hidden rounded-lg border transition ${
              selectedAvatarId === avatar.id
                ? "border-primary ring-primary/30 ring-2"
                : "hover:border-primary/60 border-[var(--border-color)]"
            }`}
            aria-label="Select avatar"
          >
            <Image
              src={avatar.url}
              alt=""
              fill
              sizes="100px"
              className="object-cover"
            />
            {avatar.isCurrent && (
              <span className="bg-primary absolute right-1 bottom-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white">
                Current
              </span>
            )}
          </button>
        ))
      ) : (
        <p className="text-content/45 col-span-full text-sm">
          No previous avatars.
        </p>
      )}
    </div>
  );
};
