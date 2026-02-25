import { Loader2 } from "lucide-react";

export function Loading({ message = "جار التحميل..." }: { message?: string }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-dvh gap-2 bg-primary-50">
      <Loader2 className="text-primary-500 animate-spin size-24" />
      <span className="animate-pulse font-bold text-xl text-base-600">
        {message}
      </span>
    </div>
  );
}
