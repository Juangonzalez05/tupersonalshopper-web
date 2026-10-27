import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

const control = [
  "w-full min-h-[52px] rounded-sm border border-line-2 bg-white px-4 py-3 font-sans text-[15px] text-ink",
  "placeholder:text-muted/70 focus:border-navy focus:outline-2 focus:outline-offset-1 focus:outline-gold",
  "aria-invalid:border-off",
].join(" ");

export function Field({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="type-label">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <span id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </span>
      ) : null}
      {error ? (
        <span id={`${id}-error`} className="text-xs text-off" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}

/** aria-* que conectan el control con su ayuda o su error. */
export function describedBy(id: string, { hint, error }: { hint?: unknown; error?: string }) {
  return {
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
  } as const;
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(control, className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-[120px] resize-y", className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-sm border border-line-2 bg-white px-3 font-sans text-[13px] text-ink",
        "disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-ink",
        className,
      )}
      {...props}
    />
  );
}

export function Checkbox({
  id,
  children,
  error,
  ...props
}: ComponentProps<"input"> & { id: string; children: ReactNode; error?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="flex items-start gap-3 text-[13px] text-muted">
        <input
          id={id}
          type="checkbox"
          className="m-0 size-5 flex-none accent-navy"
          {...describedBy(id, { error })}
          {...props}
        />
        <span>{children}</span>
      </label>
      {error ? (
        <span id={`${id}-error`} className="text-xs text-off" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
