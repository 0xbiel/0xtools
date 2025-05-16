import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col pt-2 px-4 space-y-2 bg-white dark:bg-neutral-950 flex-grow pb-4 border border-x-0 border-t-0 border-b border-neutral-200 dark:border-neutral-800">
      {children}
    </div>
  );
}
