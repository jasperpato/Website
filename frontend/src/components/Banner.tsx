import { AlertCircle, LucideProps, HelpCircle, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';


interface BannerTypeProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  textColor: string,
  borderColor: string,
  backgroundColor: string,
}

export const BannerType = Object.freeze({
  INFO: { icon: HelpCircle, textColor: "text-warning", borderColor: "border-warning", backgroundColor: "bg-warning/12" } as BannerTypeProps,
  ERROR: { icon: AlertCircle, textColor: "text-error", borderColor: "border-error", backgroundColor: "bg-error/12" } as BannerTypeProps,
  SUCCESS: { icon: CheckCircle, textColor: "text-success", borderColor: "border-success", backgroundColor: "bg-success/12" } as BannerTypeProps,
});

type BannerType = typeof BannerType[keyof typeof BannerType]

export interface BannerProps {
  text: string;
  type: BannerType;
  duration?: number,
  className?: string;
  key: any
};

export function Banner({ text, type, duration, className, key }: BannerProps) {
  const [visible, setVisible] = useState(true)
  
  useEffect(() => {
    setVisible(true)
    if (duration) setTimeout(() => setVisible(false), duration)
  }, [key]);
  
  return visible ? (
    <div className={`flex items-center gap-2 ${type.textColor} border ${type.borderColor} ${type.backgroundColor} rounded px-3 py-2 ${className || ""}`}>
      <type.icon size={18} className="shrink-0" />
      <span className={type.textColor}>{text}</span>
    </div>
  ) : <></>;
}
