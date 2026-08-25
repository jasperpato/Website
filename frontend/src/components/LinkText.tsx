import { ReactNode } from 'react';

interface LinkTextProps {
    children: ReactNode;
    className?: string;
    onClick: () => void;
}

export default function LinkText({ children, onClick, className }: LinkTextProps) {
  return (
    <p
      onClick={onClick}
      className={`text-primary hover:text-secondary hover:cursor-pointer ${className || ""}`}
    >
      {children}
    </p>
  );
}
