import { Modal } from "@ecommerce/ui";
import Image from "next/image";
import { useEffect, useState } from "react";

export interface IAvatarGalleryProps {
  avatars: {
    id: string;
    url: string;
    isCurrent?: boolean;
  }[];
  selectedAvatarId?: string;
  onSetAvatar: (id: string) => void;
}

export const AvatarGallery = ({
  avatars,
  selectedAvatarId,
  onSetAvatar,
}: IAvatarGalleryProps) => {
  const [contextMenu, setContextMenu] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
        {avatars.length > 0 ? (
          avatars.map((avatar) => (
            <button
              key={avatar.id}
              type="button"
              onClick={() => setPreviewAvatarUrl(avatar.url)}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ id: avatar.id, x: e.clientX, y: e.clientY });
              }}
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

      {contextMenu && (
        <div
          className="fixed z-50 flex min-w-[140px] flex-col overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-1 shadow-2xl"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button
            type="button"
            className="text-content hover:bg-content/5 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            onClick={() => {
              const url = avatars.find((a) => a.id === contextMenu.id)?.url;
              if (url) setPreviewAvatarUrl(url);
              setContextMenu(null);
            }}
          >
            Preview
          </button>
          <button
            type="button"
            className="hover:bg-primary/10 text-primary rounded-md px-3 py-2 text-left text-sm font-medium transition-colors"
            onClick={() => onSetAvatar(contextMenu.id)}
          >
            Set as Current
          </button>
        </div>
      )}

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewAvatarUrl}
        onClose={() => setPreviewAvatarUrl(null)}
        panelClassName="max-w-sm p-6"
      >
        <h3 className="text-content mb-4 text-lg font-bold">Avatar Preview</h3>
        {previewAvatarUrl && (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-[var(--border-color)]">
            <Image
              src={previewAvatarUrl}
              alt="Avatar Preview"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        )}
      </Modal>
    </>
  );
};
