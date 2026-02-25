import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FileText, GripVertical, Upload, X } from "lucide-react";
import { AnimatePresence, Reorder, useDragControls } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

interface FileUploaderProps {
  value?: (File | string)[];
  onChange: (files: (File | string)[]) => void;
  onBlur: () => void;
  error?: boolean;
  id: string;
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  maxFiles?: number;
}

export function FileUploader({
  value,
  onChange,
  onBlur,
  error,
  id,
  accept = "image/*",
  multiple = false,
  maxSizeMB = 5,
  maxFiles = 5,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const files = useMemo(() => {
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }, [value]);

  const limit = multiple ? maxFiles : 1;
  const isFull = files.length >= limit;

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(
      (file) => file.size <= maxSizeMB * 1024 * 1024,
    );

    if (validFiles.length === 0) return;

    if (multiple) {
      const availableSlots = limit - files.length;
      if (availableSlots <= 0) return;
      const filesToAdd = validFiles.slice(0, availableSlots);
      onChange([...files, ...filesToAdd]);
    } else {
      onChange(validFiles.slice(0, 1));
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    const updated = files.filter((_, i) => i !== indexToRemove);
    onChange(updated);
  };

  const handleReorder = (newOrder: (File | string)[]) => {
    onChange(newOrder);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="relative">
        <input
          ref={inputRef}
          type="file"
          id={id}
          accept={accept}
          multiple={multiple}
          disabled={isFull}
          className="sr-only"
          onBlur={onBlur}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <Label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            if (!isFull) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!isFull) handleFiles(e.dataTransfer.files);
          }}
          className={cn(
            "relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all",
            isFull
              ? "opacity-50 cursor-not-allowed bg-muted/50 border-muted-foreground/10"
              : "cursor-pointer bg-muted/30 border-muted-foreground/20 hover:bg-primary-50 hover:border-primary-500",
            isDragging && "bg-primary-50 border-primary-500 scale-[1.01]",
            error && "border-destructive/50 bg-destructive/5",
          )}
        >
          <div className="flex flex-col items-center gap-2 pointer-events-none">
            <Upload
              className={cn(
                "size-6 transition-transform",
                isDragging && "animate-bounce text-primary-500",
                isFull && "text-muted-foreground",
              )}
            />
            <div className="text-center">
              <p className="text-sm font-medium">
                {isFull
                  ? "تم الوصول للحد الأقصى"
                  : multiple
                    ? "ارفع ملف أو أكثر"
                    : "اضغط أو اسحب لرفع ملف"}
              </p>
              <p className="text-xs text-base-400">
                الحد الأقصى {maxSizeMB} ميجابايت
                {multiple && ` • حتى ${maxFiles} ملفات`}
              </p>
            </div>
          </div>
        </Label>
      </div>

      {files.length > 0 && (
        <Reorder.Group
          axis="y"
          values={files}
          onReorder={handleReorder}
          className="flex flex-col gap-2"
        >
          <AnimatePresence initial={false}>
            {files.map((file, index) => (
              <DraggableFilePreview
                key={file instanceof File ? `${file.name}-${file.size}` : file}
                file={file}
                onRemove={() => removeFile(index)}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}

function DraggableFilePreview({
  file,
  onRemove,
}: {
  file: File | string;
  onRemove: () => void;
}) {
  const controls = useDragControls();

  const isImage =
    typeof file === "string"
      ? file.startsWith("blob:") ||
        file.startsWith("data:image/") ||
        /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file.split("?")[0])
      : typeof file?.type === "string" && file.type.startsWith("image/");

  const [preview, setPreview] = useState<string | null>(
    typeof file === "string" ? file : null,
  );

  useEffect(() => {
    if (file instanceof File && isImage) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  const fileName = file instanceof File ? file.name : file.split("/").pop();
  const fileSize =
    file instanceof File && `${(file.size / 1024).toFixed(0)} KB`;

  return (
    <Reorder.Item
      value={file}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileDrag={{ scale: 1.02, zIndex: 10 }}
      className="flex items-center gap-3 p-2 rounded-lg border bg-card text-card-foreground select-none relative"
    >
      <div
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground touch-none"
      >
        <GripVertical className="size-5" />
      </div>

      <div className="size-10 shrink-0 rounded bg-muted flex items-center justify-center overflow-hidden border">
        {isImage && preview ? (
          <img src={preview} alt="preview" className="object-cover size-full" />
        ) : (
          <FileText className="size-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate">
          {fileName}
        </p>
        <p className="text-[10px] text-muted-foreground">{fileSize}</p>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-7 text-muted-foreground hover:text-destructive transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X className="size-4" />
      </Button>
    </Reorder.Item>
  );
}
