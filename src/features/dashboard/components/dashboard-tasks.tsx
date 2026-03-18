/* eslint-disable @typescript-eslint/no-explicit-any */
import { MANUSCRIPTS } from "@/constants";
import { cn } from "@/lib/utils";
import type { TaskStatus } from "@/types/common";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import Badge, { type BadgeVariant } from "../../../components/common/badge";

const badgeVariant: Record<TaskStatus, BadgeVariant> = {
  "قيد التنفيذ": "info",
  متاخر: "warning",
  مكتمل: "success",
  جيدة: "success",
  متوسطة: "warning",
  ضعيفة: "danger",
  مرفوض: "danger",
};

export function Task({ task, className }: { task: any; className?: string }) {
  return (
    <Link to="/dashboard/manuscrits/$id" params={{ id: task.id }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        className={cn(
          "flex flex-col justify-start items-center  @sm:flex-row @sm:items-center @sm:justify-between gap-2  border w-full rounded-md py-3 px-6",
          className,
        )}
      >
        <div className="space-y-1">
          <p className="text-sm font-semibold text-base-800">{task.title}</p>
          <p className="text-xs">
            المرحلة {task.currentStep} • {task.id}
          </p>
        </div>
        <Badge
          variant={badgeVariant[task.stepStatus as TaskStatus] ?? "default"}
        >
          {task.stepStatus}
        </Badge>
      </motion.div>
    </Link>
  );
}

export default function DashboardTasks({
  tasks,
  className,
}: {
  tasks: any;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col @container", className)}>
      {tasks.map((t) => {
        const task = MANUSCRIPTS.find((m) => m.id === t.bookId);
        return <Task key={`${task?.id}-${task?.title}`} task={task} />;
      })}
    </div>
  );
}
