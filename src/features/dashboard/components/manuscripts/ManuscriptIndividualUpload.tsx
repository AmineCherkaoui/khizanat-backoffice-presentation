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
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize2,
  MessageSquareWarning,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { useStorage } from "../../store/useStorage";
import { cn } from "@/lib/utils";
import { BaseModal } from "@/components/common/base-modal";

type Props = {
  manuscript: ManuscriptType;
};

type UploadingPage = {
  pageNum: number;
  progress: number;
  previewUrl: string;
  fileName: string;
};

const ITEMS_PER_PAGE = 10;

export default function ManuscriptIndividualUpload({ manuscript }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadingPages, setUploadingPages] = useState<
    Map<number, UploadingPage>
  >(new Map());
  const [pageToDelete, setPageToDelete] = useState<number | null>(null);

  const { addManuscriptPages, deleteManuscriptPage, manuscripts } =
    useStorage();

  // Always read live data from the store instead of the stale loader prop
  const liveManuscript =
    manuscripts.find((m) => m.id === manuscript.id) ?? manuscript;

  const totalItems = liveManuscript?.numPages || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const visiblePages = useMemo(() => {
    return Array.from({ length: totalItems }, (_, i) => i + 1).slice(
      startIndex,
      endIndex,
    );
  }, [totalItems, startIndex, endIndex]);

  const simulateUploadProgress = useCallback(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    (pageNum: number, file: File) => {
      const imageUrl = URL.createObjectURL(file);

      // Set uploading state with preview
      setUploadingPages((prev) => {
        const next = new Map(prev);
        next.set(pageNum, {
          pageNum,
          progress: 0,
          previewUrl: imageUrl,
          fileName: file.name,
        });
        return next;
      });

      // Simulate progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);

          deleteManuscriptPage(manuscript.id, pageNum);

          const newPage = {
            id: pageNum,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            status: "محملة",
            url: imageUrl,
          };

          addManuscriptPages(manuscript.id, [newPage]);

          setUploadingPages((prev) => {
            const next = new Map(prev);
            next.delete(pageNum);
            return next;
          });

          toast.success(`تم رفع الصفحة ${pageNum} بنجاح`);
        } else {
          setUploadingPages((prev) => {
            const next = new Map(prev);
            const existing = next.get(pageNum);
            if (existing) {
              next.set(pageNum, {
                ...existing,
                progress: Math.min(progress, 95),
              });
            }
            return next;
          });
        }
      }, 200);
    },
    [addManuscriptPages, manuscript?.id],
  );

  const handleFileUpload = useCallback(
    (pageNum: number, file: File) => {
      if (!file) return;
      simulateUploadProgress(pageNum, file);
    },
    [simulateUploadProgress],
  );

  if (!manuscript) return null;

  return (
    <div className="mt-4 flex flex-col gap-4">
      {totalItems > 0 ? (
        <>
          <div className="h-auto max-h-128 overflow-y-auto pr-2">
            <div className="flex flex-col gap-2">
              {visiblePages.map((pageNum) => {
                const uploadingPage = uploadingPages.get(pageNum);
                const uploadedPage = liveManuscript?.pages?.find(
                  (p: {
                    id: number;
                    url: string;
                    size: string;
                    status: string;
                    observation?: string;
                  }) => p.id === pageNum,
                );

                if (uploadingPage) {
                  return (
                    <div
                      key={`uploading-${pageNum}`}
                      className="relative flex justify-between items-center border border-primary-200 rounded-lg px-4 py-3 bg-primary-50/50 overflow-hidden"
                    >
                      <div
                        className="absolute inset-0 bg-primary-100/50 transition-all duration-300 ease-out"
                        style={{ width: `${uploadingPage.progress}%` }}
                      />

                      <div className="relative flex gap-4 items-center z-10">
                        <div className="relative size-12 bg-base-100 overflow-hidden rounded flex items-center justify-center shrink-0 border border-primary-200">
                          <img
                            src={uploadingPage.previewUrl}
                            alt={`Page ${pageNum}`}
                            className="object-cover size-full pointer-events-none"
                          />
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <Loader2 className="size-5 text-white animate-spin" />
                          </div>
                        </div>

                        <div className="flex flex-col">
                          <h3 className="font-bold text-sm text-primary-700">
                            صفحة {pageNum}
                          </h3>
                          <span className="text-xs text-primary-500 max-w-[150px] truncate">
                            {uploadingPage.fileName}
                          </span>
                          <span className="text-xs text-primary-400 font-medium">
                            جاري الرفع... {Math.round(uploadingPage.progress)}%
                          </span>
                        </div>
                      </div>

                      <div className="relative flex items-center gap-2 z-10">
                        <Badge
                          variant="warning"
                          className="rounded text-amber-600"
                        >
                          <Loader2 className="size-3 animate-spin" />
                          جاري الرفع
                        </Badge>
                      </div>
                    </div>
                  );
                }

                // Already uploaded - show with live preview
                if (uploadedPage) {
                  return (
                    <div
                      key={`uploaded-${pageNum}`}
                      className={cn(
                        "flex flex-col border rounded-lg px-4 py-3 transition-colors",
                        uploadedPage.observation &&
                          uploadedPage.observation.trim() !== ""
                          ? "bg-yellow-50 border-yellow-500"
                          : "bg-white border-base-200",
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4 items-center">
                          <div
                            onClick={() => setPreviewImage(uploadedPage.url)}
                            className="relative group size-12 bg-base-100 overflow-hidden rounded flex items-center justify-center shrink-0 cursor-pointer transition-all border"
                          >
                            <img
                              src={uploadedPage.url}
                              alt={`Page ${pageNum}`}
                              className="object-cover size-full pointer-events-none"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Maximize2 className="size-5 text-white drop-shadow-md" />
                            </div>
                          </div>

                          <div className="flex flex-col">
                            <h3 className="font-bold text-sm">
                              صفحة {pageNum}
                            </h3>
                            <span className="text-xs text-gray-500 max-w-[150px] truncate">
                              {uploadedPage.url?.split("/").pop()}
                            </span>
                            <span className="text-xs text-gray-400">
                              {uploadedPage.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Re-upload button */}
                          <label className="flex items-center justify-center p-2 rounded-lg text-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-300">
                            <RefreshCw size={16} />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  deleteManuscriptPage(
                                    manuscript?.id,
                                    uploadedPage.id,
                                  );
                                  handleFileUpload(pageNum, file);
                                }
                                e.target.value = "";
                              }}
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => {
                              setPageToDelete(uploadedPage.id);
                            }}
                            className="flex items-center justify-center p-2 rounded-lg text-destructive transition-all duration-300 hover:bg-red-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {uploadedPage.observation &&
                        uploadedPage.observation.trim() !== "" && (
                          <div className="mt-3 pt-3 border-t border-yellow-500 flex gap-2 items-center">
                            <div className="bg-red-500 p-2 rounded-full flex items-center justify-center ">
                              <MessageSquareWarning className="size-4 text-white shrink-0" />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className=" text-sm font-bold text-yellow-800 uppercase tracking-tight">
                                ملاحظة المراجعة
                              </span>
                              <p className="text-sm text-yellow-900 leading-relaxed">
                                {uploadedPage.observation}
                              </p>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                }

                // Not uploaded yet - show placeholder with upload
                return (
                  <div
                    key={`placeholder-${pageNum}`}
                    className="flex justify-between items-center border border-dashed border-gray-300 rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="size-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
                        <span className="text-gray-400 font-medium">
                          {pageNum}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <h3 className="font-bold text-sm text-gray-500">
                          صفحة {pageNum}
                        </h3>
                        <span className="text-xs text-gray-400">
                          في انتظار التحميل...
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center justify-center py-1 px-6 rounded-lg text-primary-500 hover:bg-primary-50 cursor-pointer transition-all duration-300">
                        <Upload size={16} />
                        <span className="text-sm mr-2 font-medium">تحميل</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(pageNum, file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t mt-2">
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
          <p>لا يوجد صفحات محددة لهذه المخطوطة</p>
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

      <BaseModal
        open={pageToDelete !== null}
        onOpenChange={(open) => !open && setPageToDelete(null)}
        title={`حذف الصفحة ${pageToDelete}`}
        description={`هل أنت متأكد من حذف الصفحة؟ لا يمكن التراجع عن هذا الإجراء.`}
        variant="alert"
        confirmText="حذف الصفحة"
        cancelText="إلغاء"
        onConfirm={() => {
          if (pageToDelete !== null) {
            deleteManuscriptPage(manuscript?.id, pageToDelete);
            toast.success("تم حذف الصفحة بنجاح");
            setPageToDelete(null);
          }
        }}
      />
    </div>
  );
}
