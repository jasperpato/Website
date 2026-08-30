import { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Button from './Button';
import { Banner, BannerProps } from './Banner';
import { useState, useRef } from 'react';
import Scrim from './Scrim';


interface ModalButton {
    label: string;
    onClick: () => void | Promise<void>;
    enabled: boolean;
}

interface ModalProps {
    title?: string;
    onClose?: () => void;
    onBack?: () => void;
    leftButton?: ModalButton | null;
    rightButton?: ModalButton | null;
    children?: ReactNode;
    bannerProps?: BannerProps;
    modalMessage?: string
}

export default function Modal({ title, onClose, onBack, leftButton, rightButton, children, bannerProps, modalMessage }: ModalProps) {
    const [submitting, setSubmitting] = useState(false);

    const onRightClick = async () => {
        setSubmitting(true)
        try {
            await rightButton?.onClick()
        } finally {
            setSubmitting(false)
        }
    }

    const backdropMouseDown = useRef(false);

    const buttonClassName = "w-40"

    return (
        // <div
        //     className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        //     onMouseDown={(e) => backdropMouseDown.current = e.target === e.currentTarget }
        //     onClick={(e) => {
        //         if (backdropMouseDown.current && e.target === e.currentTarget) onClose?.();
        //         backdropMouseDown.current = false;
        //     }}
        // >
        //     
        <Scrim onClose={onClose}>
            <div className="bg-[Canvas] rounded-lg w-full max-w-md mx-4 flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="relative flex items-center justify-center p-4 border-b border-border">
                    {onBack && (
                        <button onClick={onBack} className="absolute left-4 cursor-pointer bg-transparent border-none flex items-center text-muted hover:text-primary">
                            <ArrowLeft size={20} />
                        </button>
                        )}
                        <span className="font-semibold text-lg">{title}</span>
                        {onClose && (
                        <button onClick={onClose} className="absolute right-4 cursor-pointer bg-transparent border-none flex items-center text-muted hover:text-primary">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {modalMessage && <div className="pt-4 px-4">
                    {modalMessage}
                </div>}

                <div className="p-4 flex-1 flex flex-col gap-3">
                    {children}
                </div>

                {bannerProps && <Banner {...bannerProps} className="m-4" />}

                <div className="flex justify-center items-center gap-3 p-4 border-t border-border">
                    {leftButton && <Button label={leftButton.label} onClick={leftButton.onClick} enabled={leftButton.enabled} className={buttonClassName} />}
                    {rightButton && <Button label={rightButton.label} onClick={onRightClick} primary enabled={rightButton.enabled && !submitting} className={buttonClassName} />}
                </div>
            </div>
        </Scrim>
        // </div>
    );
}
