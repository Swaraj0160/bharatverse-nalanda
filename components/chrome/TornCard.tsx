import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  as?: "div" | "article" | "section" | "aside";
  bleaf?: boolean;
};

/** A leaf of manuscript: torn top/bottom deckle edges, ruled margin line. */
export function TornCard({ children, className, as = "div", bleaf, ...rest }: Props & { bleaf?: boolean }) {
  const Tag = as;
  return (
    <Tag
      className={clsx(
        "relative border-x border-ink/20 bg-leaf px-6 py-5",
        "shadow-leaf",
        "before:absolute before:inset-x-0 before:-top-[10px] before:h-[10px] before:bg-leaf before:edge-torn before:border-t before:border-ink/20",
        "after:absolute after:inset-x-0 after:-bottom-[10px] after:h-[10px] after:rotate-180 after:bg-leaf after:edge-torn after:border-t after:border-ink/20",
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-3 left-3 w-px bg-hingula/25"
      />
      {children}
    </Tag>
  );
}
