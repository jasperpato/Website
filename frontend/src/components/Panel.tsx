import { ReactNode } from "react";

interface PanelProps {
  children: ReactNode
}

export default function Panel({ children }: PanelProps) {
  return (
    <div className="flex-1 rounded-lg border border-border p-4">
      {children}
    </div>
  );
}
