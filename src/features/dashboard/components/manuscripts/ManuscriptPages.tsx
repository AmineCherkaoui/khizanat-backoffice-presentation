import Badge from "@/components/common/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import type { ManuscriptType } from "@/types/common";
import { useNavigate } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Trash2,
  X,
} from "lucide-react";
import { Reorder } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";

type Props = {
  manuscript: ManuscriptType;
};

const ITEMS_PER_PAGE = 5;

export default function ManuscriptPages({ manuscript }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { reorderManuscriptPages, deleteManuscriptPage } = useStorage();

  const totalItems = manuscript?.pages?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const visiblePages = useMemo(() => {
    return manuscript?.pages?.slice(startIndex, endIndex) || [];
  }, [manuscript?.pages, startIndex, endIndex]);

  const [localPages, setLocalPages] = useState(visiblePages);
  useEffect(() => {
    setLocalPages(visiblePages);
  }, [visiblePages]);

  const handleReorder = (newOrder: typeof visiblePages) => {
    setLocalPages(newOrder);
  };

  const handleDragEnd = () => {
    if (!manuscript) return;

    const newFullList = [...manuscript?.pages];
    newFullList.splice(startIndex, localPages.length, ...localPages);

    reorderManuscriptPages(
      manuscript.id,
      newFullList.map((p, i) => {
        return { ...p, id: i + 1 };
      }),
    );
  };

  const navigate = useNavigate();

  if (!manuscript) return null;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {manuscript?.pages?.length > 0 ? (
        <>
          <div className="h-auto max-h-128">
            <Reorder.Group
              axis="y"
              values={localPages}
              onReorder={handleReorder}
              className="flex flex-col gap-2"
            >
              {localPages.map((item, index) => (
                <Reorder.Item
                  key={`${item?.url}`}
                  value={item}
                  onDragEnd={handleDragEnd}
                  whileDrag={{
                    scale: 1.02,
                    boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
                  }}
                  className="flex justify-between items-center border border-base-200 rounded-lg px-4 py-3 bg-white select-none cursor-grab active:cursor-grabbing"
                >
                  <div className="flex gap-4 items-center">
                    <div
                      onClick={() => setPreviewImage(item?.url)}
                      className="relative group size-12 bg-base-100 overflow-hidden rounded flex items-center justify-center shrink-0 cursor-pointer transition-all"
                    >
                      <img
                        src={item?.url}
                        alt={`Page ${startIndex + index + 1}`}
                        className="object-cover size-full pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="size-5 text-white drop-shadow-md" />
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <h3 className="font-bold text-sm">
                        صفحة {startIndex + index + 1}
                      </h3>
                      <span className="text-xs text-gray-500 max-w-[150px] truncate">
                        {item?.url?.split("/").pop()}
                      </span>
                      <span className="text-xs text-gray-400">
                        {item?.size}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="success" className="rounded text-green-500">
                      <Check className="size-4" />
                      {item?.status}
                    </Badge>

                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={() => {
                        deleteManuscriptPage(manuscript?.id, item?.id);
                        navigate({ to: "." });
                        toast.success("تم حذف الصفحات بنجاح");
                      }}
                      className="flex items-center justify-center p-2 rounded-lg text-destructive transition-all duration-300 hover:bg-red-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-sm text-gray-500">
                عرض {startIndex + 1} - {Math.min(endIndex, totalItems)} من{" "}
                {totalItems}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronRight className="size-4" />
                </Button>

                <span className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                >
                  <ChevronLeft className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center mt-4 text-sm text-gray-500 py-8 border border-dashed rounded-lg">
          <p>لم يتم تحميل أي صفحة</p>
        </div>
      )}

      <Dialog
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />
          <DialogContent
            showCloseButton={false}
            className="flex flex-col justify-center items-center bg-transparent border-none shadow-none sm:max-w-[90dvw] max-h-[90dvh]"
          >
            <div className="flex-1 flex items-center justify-center ">
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Page Preview"
                  className="object-contain max-h-[90dvh] w-auto rounded-md"
                />
              )}
            </div>
          </DialogContent>

          <DialogClose asChild>
            <button className="fixed top-4 right-4 z-9999 bg-white p-2 rounded-full">
              <X className="size-6 text-base-800" />
            </button>
          </DialogClose>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
