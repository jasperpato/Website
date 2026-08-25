import { useRef } from "react";
import React from 'react';

interface ScrimProps {
    children: React.ReactNode,
    onClose?: () => void
}

export default function Scrim({ children, onClose }: ScrimProps) {
    const backdropMouseDown = useRef(false);

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onMouseDown={(e) => backdropMouseDown.current = e.target === e.currentTarget }
            onClick={(e) => {
                if (backdropMouseDown.current && e.target === e.currentTarget) onClose?.();
                backdropMouseDown.current = false;
            }}
        >
            {children}
        </div>
    );
}