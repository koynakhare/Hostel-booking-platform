import { useCallback, useState, type DragEvent } from "react";
import HostelImage from "@/components/ui/HostelImage";

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  existingUrls?: string[];
  onRemoveExisting?: (url: string) => void;
  accept?: string;
  maxFiles?: number;
  label?: string;
}

export default function FileUpload({
  files,
  onChange,
  existingUrls = [],
  onRemoveExisting,
  accept = "image/*",
  maxFiles = 5,
  label = "Upload images",
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const totalImages = existingUrls.length + files.length;
  const remainingSlots = Math.max(0, maxFiles - totalImages);

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming || remainingSlots === 0) return;
      const newFiles = Array.from(incoming).slice(0, remainingSlots);
      onChange([...files, ...newFiles]);
    },
    [files, remainingSlots, onChange],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-text-primary">{label}</p>

      {(existingUrls.length > 0 || files.length > 0) && (
        <div className="space-y-2">
          <p className="text-xs text-text-muted">
            Images ({totalImages}/{maxFiles})
          </p>
          <div className="flex flex-wrap gap-3">
            {existingUrls.map((url, i) => (
              <div key={url} className="group relative">
                <HostelImage
                  src={url}
                  alt={`Hostel image ${i + 1}`}
                  className="h-20 w-20 rounded-lg object-cover"
                />
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => onRemoveExisting(url)}
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            {files.map((file, i) => (
              <div key={`${file.name}-${i}`} className="group relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="h-20 w-20 rounded-lg object-cover ring-2 ring-accent/40"
                />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {remainingSlots > 0 && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center rounded-card border-2 border-dashed px-6 py-8 transition-colors ${
            dragging
              ? "border-accent bg-accent/5"
              : "border-border-subtle bg-bg-page/50"
          }`}
        >
          <svg className="mb-2 h-8 w-8 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-text-muted">
            Drag & drop images here, or{" "}
            <label className="cursor-pointer font-medium text-accent hover:underline">
              browse
              <input
                type="file"
                accept={accept}
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
            </label>
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {remainingSlots} more allowed, 5MB each
          </p>
        </div>
      )}
    </div>
  );
}
