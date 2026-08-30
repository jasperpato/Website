import { ReactNode } from "react";

interface PanelBoxProps {
  title: string,
  children: ReactNode
}

export default function PanelBox({ title, children }: PanelBoxProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-bold text-base">{title}</h3>
      {children}
    </div>
  );
}
