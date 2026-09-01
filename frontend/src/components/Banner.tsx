import { AlertCircle, LucideProps, HelpCircle, CheckCircle, CrossIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import IconButton, { IconSize } from './IconButton';


interface BannerTypeProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  color: string,
}

export const BannerType = Object.freeze({
  INFO: { icon: HelpCircle, color: "warning" } as BannerTypeProps,
  ERROR: { icon: AlertCircle, color: "error" } as BannerTypeProps,
  // SUCCESS: { icon: CheckCircle, textColor: "text-success", borderColor: "border-success", backgroundColor: "bg-success/12" } as BannerTypeProps,
  SUCCESS: { icon: CheckCircle, color: "success" } as BannerTypeProps,
});

type BannerType = typeof BannerType[keyof typeof BannerType]

export interface BannerProps {
  text: string;
  type: BannerType;
  duration?: number,
  className?: string;
  key: any,
  closeable: boolean
};

export function Banner({ text, type, duration, className, key, closeable = false }: BannerProps) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    setVisible(true)
    if (duration) setTimeout(() => setVisible(false), duration)
  }, [key]);
  
  const color = `var(--color-${type.color})`

  return visible ? (
    <div
      className={`flex flex-row items-center justify-between border rounded px-3 py-2 ${className || ""}`}
      style={{ color, borderColor: color, backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)` }}
    >
      <div className="flex flex-row items-center justify-start gap-2">
        <type.icon size={18} className="shrink-0" />
        <span>{text}</span>
      </div>

      {closeable && <IconButton color={color} icon={XIcon} size={IconSize.SMALL} onClick={() => setVisible(false)} />}
    </div>
  ) : <></>;
}
