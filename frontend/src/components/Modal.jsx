import { ArrowLeft, X } from 'lucide-react';
import Button from './Button';

export default function Modal({ title, onClose, onBack, leftAction, rightAction, leftEnabled = true, rightEnabled = true, children }) {
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

        <div className="flex justify-center items-center gap-3 p-4 border-t border-border">
          {leftAction && <Button label={leftAction.label} onClick={leftAction.onClick} enabled={leftEnabled} />}
          <Button label={rightAction?.label} onClick={rightAction?.onClick} primary enabled={rightEnabled} />
        </div>
      </div>
    </div>
  );
}
