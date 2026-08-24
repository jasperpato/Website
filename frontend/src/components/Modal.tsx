import { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Button from './Button';

interface ModalButton {
  label: string;
  onClick: () => void;
  enabled: boolean;
}

interface ModalProps {
  title?: string;
  onClose?: () => void;
  onBack?: () => void;
  leftButton?: ModalButton | null;
  rightButton?: ModalButton | null;
  children?: ReactNode;
  errorMessage?: string;
}

export default function Modal({ title, onClose, onBack, leftButton, rightButton, children, errorMessage }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose || undefined}>
      <div className="bg-white rounded-lg w-full max-w-md mx-4 flex flex-col" onClick={e => e.stopPropagation()}>
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

        <div className="p-4 flex-1">
          {children}
        </div>

        {errorMessage && <div className="p-4 flex-1 text-error">
          {errorMessage}
        </div>}

        <div className="flex justify-center items-center gap-3 p-4 border-t border-border">
          {leftButton && <Button label={leftButton.label} onClick={leftButton.onClick} enabled={leftButton.enabled} />}
          {rightButton && <Button label={rightButton.label} onClick={rightButton.onClick} primary enabled={rightButton.enabled} />}
        </div>
      </div>
    </div>
  );
}
