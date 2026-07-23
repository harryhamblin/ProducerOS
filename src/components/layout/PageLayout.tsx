import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex-1 overflow-auto">
      <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-8 py-8">
        {children}
      </div>
    </div>
  );
}