import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  };
}

/** Brand mark: a bold "T" monogram with an accent spark. */
export function LogoMark(props: IconProps) {
  return (
    <svg {...base(props)} viewBox="0 0 24 24" fill="none">
      <rect x="0.5" y="0.5" width="23" height="23" rx="6" fill="#dc2626" stroke="none" />
      <rect x="5" y="6" width="14" height="3.4" rx="1.7" fill="white" stroke="none" />
      <rect x="10.3" y="6" width="3.4" height="13" rx="1.7" fill="white" stroke="none" />
      <circle cx="17.5" cy="16.5" r="1.7" fill="white" stroke="none" opacity={0.9} />
    </svg>
  );
}

export function MergeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3v6.5M16 3v6.5M4 20l4-6.5h8l4 6.5M12 13.5V21" />
      <path d="M8 9.5a4 4 0 0 0 4 4 4 4 0 0 0 4-4" />
    </svg>
  );
}

export function SplitIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3" width="7" height="18" rx="1.2" />
      <rect x="13" y="3" width="7" height="18" rx="1.2" strokeDasharray="3 3" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

export function RotateIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4.5 12a7.5 7.5 0 1 1 2.5 5.6" />
      <path d="M4 15.5V21h5.5" />
    </svg>
  );
}

export function CompressIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9 4H5a1 1 0 0 0-1 1v4M15 4h4a1 1 0 0 1 1 1v4M9 20H5a1 1 0 0 1-1-1v-4M15 20h4a1 1 0 0 0 1-1v-4" />
      <path d="M9 9h6v6H9z" />
    </svg>
  );
}

export function WatermarkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M8 16.5 16 7.5" strokeWidth={2.4} />
    </svg>
  );
}

export function HashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="3" width="16" height="18" rx="1.5" />
      <path d="M9 16h6M9 12h6" />
    </svg>
  );
}

export function ImageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="m4 18 5-5 3 3 4-5 4 5" />
    </svg>
  );
}

export function PdfDocIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3h5l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M13 3v4a1 1 0 0 0 1 1h4" />
    </svg>
  );
}

export function ShieldCheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5z" />
    </svg>
  );
}

export function SparklesIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v4M12 17v4M4 12h4M16 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />
    </svg>
  );
}

export function DeviceIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 8 12 3.5 7.5 8M12 3.5V16" />
    </svg>
  );
}

export function StarIcon(props: IconProps) {
  return (
    <svg {...base(props)} fill="currentColor" stroke="none">
      <path d="M12 2.5l2.9 6 6.6.6-5 4.4 1.5 6.5L12 16.8 6 20l1.5-6.5-5-4.4 6.6-.6z" />
    </svg>
  );
}

export function CurrencyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 8.5c0-1 1-1.5 2.3-1.5 1.6 0 2.7.8 2.7 2s-1.1 1.7-2.5 2c-1.5.3-2.5.9-2.5 2.1 0 1.2 1.1 1.9 2.7 1.9 1.3 0 2.3-.5 2.3-1.5M12 6v1.2M12 16.8V18" />
    </svg>
  );
}

export function RulerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="7" width="18" height="10" rx="1.5" transform="rotate(-8 12 12)" />
      <path d="M7 9.5 6.5 11M10 9 9.5 10.5M13 8.5 12.5 10M16 8l-.5 1.5" />
    </svg>
  );
}

export function ThermometerIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 14.5V5a2 2 0 1 0-4 0v9.5a4 4 0 1 0 4 0z" />
      <circle cx="10" cy="17" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="5" width="17" height="15" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

export function ScaleIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3v18M7 21h10M5 7h6M5 7l-3 6a3 3 0 0 0 6 0zM17 7l-3-1M17 7l3 6a3 3 0 0 1-6 0z" />
    </svg>
  );
}

export function PercentIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 18 18 6" />
      <circle cx="7.5" cy="7.5" r="2" />
      <circle cx="16.5" cy="16.5" r="2" />
    </svg>
  );
}

export function CalculatorIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="5" y="3" width="14" height="18" rx="1.5" />
      <path d="M8 7h8M8 12h1M12 12h1M16 12h1M8 15.5h1M12 15.5h1M16 15.5h1M8 19h1M12 19h1M16 19h1" />
    </svg>
  );
}

export function ReceiptIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z" />
      <path d="M9 8h6M9 12h6M9 16h4" />
    </svg>
  );
}

export function CaseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 16 6.5 7 10 16M4 13h5" />
      <path d="M14 10.5c1 0 2 .5 2 2v3.5M18 10.5c1 0 2 .5 2 2v3.5M14 13.5h6" />
    </svg>
  );
}

export function TextIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5h16M4 10h16M4 15h10M4 20h7" />
    </svg>
  );
}

export function CodeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 8-4.5 4L9 16M15 8l4.5 4L15 16M13 5l-2 14" />
    </svg>
  );
}

export function PaletteIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3a9 8.5 0 1 0 0 17c1 0 1.8-.8 1.8-1.8 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-1 .8-1.8 1.8-1.8H16a4 3.5 0 0 0 4-3.5C20 6 16.5 3 12 3z" />
      <circle cx="7.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="15.5" cy="8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BinaryIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 5v14M4 5h2M4 19h2" />
      <path d="M12 5h3.5a2 2 0 0 1 0 4H12zM12 9h4a2 2 0 0 1 0 4h-4zM12 9v9" />
    </svg>
  );
}

export function NumeralIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 6v12M8 6v12M12 6l3 12M12 6l-1.2 4.8M19 6h-3.5a1.8 1.8 0 0 0 0 3.6H19a1.8 1.8 0 0 1 0 3.6h-3.8" />
    </svg>
  );
}

export function KeyIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="8" cy="15" r="4" />
      <path d="M11 12 19.5 3.5M16.5 6 19 8.5M14 8.5 16 10.5" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </svg>
  );
}

export function DocTextIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 3h5l5 5v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <path d="M13 3v4a1 1 0 0 0 1 1h4M9 13h6M9 16.5h6M9 9.5h2" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.5v.01" />
    </svg>
  );
}

export function ReorderIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="7" y="3.5" width="14" height="4.5" rx="1" />
      <rect x="7" y="10" width="14" height="4.5" rx="1" />
      <rect x="7" y="16.5" width="14" height="4.5" rx="1" />
      <path d="M3.5 5.5v3M2 7h3M3.5 12.5v3M2 14h3M3.5 19.5v3M2 21h3" />
    </svg>
  );
}

export function StorageIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" strokeWidth={2.4} />
    </svg>
  );
}

export function SpeedIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 15a8 8 0 1 1 16 0" />
      <path d="M12 15 16 9M4 15h1M19 15h1" />
    </svg>
  );
}

export function CookingIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 9h14l-1.2 8.5a2 2 0 0 1-2 1.5H8.2a2 2 0 0 1-2-1.5z" />
      <path d="M8 9V6.5M12 9V5M16 9V6.5" />
    </svg>
  );
}

export function AreaIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="4" y="4" width="16" height="16" rx="1.5" />
      <path d="M4 4l7 7M8 4l8 8" />
    </svg>
  );
}

export function CakeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 21v-7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7z" />
      <path d="M4 17h16M8 12V9M12 12V9M16 12V9M8 6.5V5a1 1 0 1 1 2 0v.3M12 6.5V5M16 6.5V5" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M11.5 3H5a2 2 0 0 0-2 2v6.5a2 2 0 0 0 .6 1.4l8.5 8.5a2 2 0 0 0 2.8 0l6.5-6.5a2 2 0 0 0 0-2.8l-8.5-8.5A2 2 0 0 0 11.5 3z" />
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrendingUpIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 17l6-6 4 4 8-9" />
      <path d="M15 6h6v6" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 3s-5 4.5-5 9.5a5 5 0 0 0 10 0c0-1.5-.7-2.7-1.5-3.5.2 1-.2 2-1 2.3.3-2-1-3.8-2.5-5.3z" />
    </svg>
  );
}

export function GraduationCapIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M2 8.5 12 4l10 4.5-10 4.5z" />
      <path d="M6 10.7v4.3c0 1.5 2.7 2.8 6 2.8s6-1.3 6-2.8v-4.3M20 8.5v6.5" />
    </svg>
  );
}

export function LinkIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 13 4.5a3.5 3.5 0 0 1 5 5l-2 2M13 17.5l-2 2a3.5 3.5 0 0 1-5-5l2-2" />
    </svg>
  );
}

export function DiffIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="4" width="8" height="16" rx="1.2" />
      <rect x="13" y="4" width="8" height="16" rx="1.2" />
      <path d="M6 9h2M6 13h2M16 9h2M16 13h2" strokeWidth={2.2} />
    </svg>
  );
}

export function QrCodeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
      <path d="M14 14h3v3h-3zM19.5 14v3M14 19.5h3M17.5 17.5h3v3h-3z" />
    </svg>
  );
}

export function ListIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M8 6h13M8 12h13M8 18h13" />
      <path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" strokeWidth={2.6} />
    </svg>
  );
}

export function FingerprintIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 4a6 6 0 0 0-6 6v2c0 3 1 5.5 2.5 7.5M12 4a6 6 0 0 1 6 6v2c0 1.5-.2 2.8-.6 4" />
      <path d="M9 10a3 3 0 0 1 6 0v2c0 3.5-1 6-2.5 8M12 10v2c0 2.5-.5 4.5-1.5 6.3" />
    </svg>
  );
}

export function IdCardIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="5" width="18" height="14" rx="1.8" />
      <circle cx="8.5" cy="11" r="1.8" />
      <path d="M5.5 16c.5-1.5 1.7-2.3 3-2.3s2.5.8 3 2.3M14 9.5h5M14 13h5" />
    </svg>
  );
}

export function DiceIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <circle cx="8" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="8" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="8" cy="16" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
