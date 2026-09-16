import type { ComponentType, SVGProps } from 'react';
import {
  AreaIcon,
  BinaryIcon,
  CakeIcon,
  CalculatorIcon,
  CalendarIcon,
  CaseIcon,
  CodeIcon,
  CompressIcon,
  CookingIcon,
  CurrencyIcon,
  DiceIcon,
  DiffIcon,
  DocTextIcon,
  FingerprintIcon,
  FlameIcon,
  GlobeIcon,
  GraduationCapIcon,
  HashIcon,
  IdCardIcon,
  ImageIcon,
  InfoIcon,
  KeyIcon,
  LinkIcon,
  ListIcon,
  MergeIcon,
  NumeralIcon,
  PaletteIcon,
  PdfDocIcon,
  PercentIcon,
  QrCodeIcon,
  ReceiptIcon,
  ReorderIcon,
  RotateIcon,
  RulerIcon,
  ScaleIcon,
  SpeedIcon,
  SplitIcon,
  StorageIcon,
  TagIcon,
  TextIcon,
  ThermometerIcon,
  TrashIcon,
  TrendingUpIcon,
  WatermarkIcon,
} from '../components/icons';

/** Top-level site sections shown on the homepage. */
export type Section = 'pdf-toolkit' | 'everyday-conversions' | 'calculators' | 'text-data' | 'numbers-misc' | 'image-tools';

/** Sub-grouping used only within the PDF Toolkit hub page. */
export type PdfCategory = 'organize' | 'convert' | 'edit' | 'optimize';

export interface ToolDefinition {
  slug: string;
  name: string;
  description: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  section: Section;
  /** Only set for tools where section === 'pdf-toolkit'. */
  pdfCategory?: PdfCategory;
}

export interface SectionDefinition {
  id: Section;
  label: string;
  shortLabel: string;
  description: string;
  path: string;
  badge: string;
  iconGradient: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

export const SECTIONS: SectionDefinition[] = [
  {
    id: 'pdf-toolkit',
    label: 'PDF Toolkit',
    shortLabel: 'PDF Toolkit',
    description: 'Merge, split, compress, rotate, watermark and convert PDFs - all in one hub.',
    path: '/pdf-toolkit',
    badge: 'bg-red-50 text-red-700 ring-red-600/10',
    iconGradient: 'from-red-500 to-red-600',
    icon: PdfDocIcon,
  },
  {
    id: 'everyday-conversions',
    label: 'Everyday Conversions',
    shortLabel: 'Conversions',
    description: 'Currency, units, temperature, timezones and dates - the conversions you need daily.',
    path: '/everyday-conversions',
    badge: 'bg-sky-50 text-sky-700 ring-sky-600/10',
    iconGradient: 'from-sky-500 to-sky-600',
    icon: GlobeIcon,
  },
  {
    id: 'calculators',
    label: 'Calculators',
    shortLabel: 'Calculators',
    description: 'BMI, percentages, loans and tips - quick calculators for everyday decisions.',
    path: '/calculators',
    badge: 'bg-indigo-50 text-indigo-700 ring-indigo-600/10',
    iconGradient: 'from-indigo-500 to-indigo-600',
    icon: CalculatorIcon,
  },
  {
    id: 'text-data',
    label: 'Text & Data Conversion',
    shortLabel: 'Text & Data',
    description: 'Case conversion, word counts, Base64 and color formats for writers and developers.',
    path: '/text-data',
    badge: 'bg-pink-50 text-pink-700 ring-pink-600/10',
    iconGradient: 'from-pink-500 to-pink-600',
    icon: CaseIcon,
  },
  {
    id: 'numbers-misc',
    label: 'Numbers & Misc',
    shortLabel: 'Numbers & Misc',
    description: 'Number base conversion, Roman numerals and a secure password generator.',
    path: '/numbers-misc',
    badge: 'bg-teal-50 text-teal-700 ring-teal-600/10',
    iconGradient: 'from-teal-500 to-teal-600',
    icon: BinaryIcon,
  },
  {
    id: 'image-tools',
    label: 'Image Tools',
    shortLabel: 'Image Tools',
    description: 'Resize and optimize images for documents, websites and social media.',
    path: '/image-tools',
    badge: 'bg-orange-50 text-orange-700 ring-orange-600/10',
    iconGradient: 'from-orange-500 to-orange-600',
    icon: ImageIcon,
  },
];

export function getSection(id: Section): SectionDefinition {
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) throw new Error(`Unknown section: ${id}`);
  return section;
}

export const PDF_CATEGORY_STYLES: Record<PdfCategory, { label: string; badge: string; icon: string }> = {
  organize: { label: 'Organize', badge: 'bg-blue-50 text-blue-700 ring-blue-600/10', icon: 'from-blue-500 to-blue-600' },
  edit: { label: 'Edit', badge: 'bg-violet-50 text-violet-700 ring-violet-600/10', icon: 'from-violet-500 to-violet-600' },
  optimize: {
    label: 'Optimize',
    badge: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    icon: 'from-amber-500 to-amber-600',
  },
  convert: {
    label: 'Convert',
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    icon: 'from-emerald-500 to-emerald-600',
  },
};

/** Badge styling for a tool card: PDF subtools use their PDF category, everything else uses its section. */
export function getToolBadgeStyles(tool: ToolDefinition): { label: string; badge: string; icon: string } {
  if (tool.section === 'pdf-toolkit' && tool.pdfCategory) {
    return PDF_CATEGORY_STYLES[tool.pdfCategory];
  }
  const section = getSection(tool.section);
  return { label: section.shortLabel, badge: section.badge, icon: section.iconGradient };
}

export const TOOLS: ToolDefinition[] = [
  // --- PDF Toolkit ---
  {
    slug: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into a single document, in the order you choose.',
    icon: MergeIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'organize',
  },
  {
    slug: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract a page range or break a PDF into one file per page.',
    icon: SplitIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'organize',
  },
  {
    slug: 'delete-pages',
    name: 'Remove Pages',
    description: 'Delete unwanted pages from a PDF document.',
    icon: TrashIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'organize',
  },
  {
    slug: 'rotate-pdf',
    name: 'Rotate PDF',
    description: 'Rotate every page 90, 180 or 270 degrees.',
    icon: RotateIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'edit',
  },
  {
    slug: 'compress-pdf',
    name: 'Compress PDF',
    description: 'Shrink file size for faster sharing and uploads.',
    icon: CompressIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'optimize',
  },
  {
    slug: 'watermark-pdf',
    name: 'Add Watermark',
    description: 'Stamp a custom text watermark across every page.',
    icon: WatermarkIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'edit',
  },
  {
    slug: 'page-numbers',
    name: 'Add Page Numbers',
    description: 'Insert page X of N numbering at the bottom of every page.',
    icon: HashIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'edit',
  },
  {
    slug: 'images-to-pdf',
    name: 'Images to PDF',
    description: 'Convert JPG or PNG images into a single PDF file.',
    icon: ImageIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'convert',
  },
  {
    slug: 'pdf-to-images',
    name: 'PDF to Images',
    description: 'Export every PDF page as a PNG or JPG image.',
    icon: PdfDocIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'convert',
  },
  {
    slug: 'extract-pdf-text',
    name: 'Extract Text from PDF',
    description: 'Pull the plain text out of every page of a PDF document.',
    icon: DocTextIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'convert',
  },
  {
    slug: 'extract-pdf-images',
    name: 'Extract Images from PDF',
    description: 'Save the embedded photos and graphics from a PDF as PNG files.',
    icon: ImageIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'convert',
  },
  {
    slug: 'reorder-pdf-pages',
    name: 'Reorder PDF Pages',
    description: 'Rearrange the page order of a PDF document.',
    icon: ReorderIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'organize',
  },
  {
    slug: 'pdf-metadata-editor',
    name: 'Edit PDF Metadata',
    description: 'View and update a PDF\'s title, author, subject and keywords.',
    icon: InfoIcon,
    section: 'pdf-toolkit',
    pdfCategory: 'edit',
  },

  // --- Everyday Conversions ---
  {
    slug: 'currency-converter',
    name: 'Currency Converter',
    description: 'Convert between world currencies using live exchange rates.',
    icon: CurrencyIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert length, weight and volume between metric and imperial units.',
    icon: RulerIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Convert between Celsius, Fahrenheit and Kelvin instantly.',
    icon: ThermometerIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'timezone-converter',
    name: 'Timezone Converter',
    description: 'Convert a date and time between any two timezones in the world.',
    icon: GlobeIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'date-calculator',
    name: 'Date Calculator',
    description: 'Find the difference between two dates, or add/subtract days from a date.',
    icon: CalendarIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'data-storage-converter',
    name: 'Data Storage Converter',
    description: 'Convert between bits, bytes, KB, MB, GB, TB and PB.',
    icon: StorageIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'speed-converter',
    name: 'Speed Converter',
    description: 'Convert between km/h, mph, m/s, knots and ft/s.',
    icon: SpeedIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'area-converter',
    name: 'Area Converter',
    description: 'Convert between square meters, square feet, acres, hectares and more.',
    icon: AreaIcon,
    section: 'everyday-conversions',
  },
  {
    slug: 'cooking-measurement-converter',
    name: 'Cooking Measurement Converter',
    description: 'Convert cups, tablespoons and grams for common baking ingredients.',
    icon: CookingIcon,
    section: 'everyday-conversions',
  },

  // --- Calculators ---
  {
    slug: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and see which weight category it falls into.',
    icon: ScaleIcon,
    section: 'calculators',
  },
  {
    slug: 'percentage-calculator',
    name: 'Percentage Calculator',
    description: 'Find a percentage of a number, work out percentage change, and more.',
    icon: PercentIcon,
    section: 'calculators',
  },
  {
    slug: 'loan-calculator',
    name: 'Loan / EMI Calculator',
    description: 'Estimate monthly payments and total interest on a loan or mortgage.',
    icon: CalculatorIcon,
    section: 'calculators',
  },
  {
    slug: 'tip-calculator',
    name: 'Tip & Bill Split Calculator',
    description: 'Calculate the tip and split a bill evenly between any number of people.',
    icon: ReceiptIcon,
    section: 'calculators',
  },
  {
    slug: 'age-calculator',
    name: 'Age Calculator',
    description: 'Find your exact age in years, months and days, and see your next birthday countdown.',
    icon: CakeIcon,
    section: 'calculators',
  },
  {
    slug: 'discount-calculator',
    name: 'Discount Calculator',
    description: 'Work out the sale price and savings for any discount percentage.',
    icon: TagIcon,
    section: 'calculators',
  },
  {
    slug: 'gst-vat-calculator',
    name: 'GST / VAT Calculator',
    description: 'Add or extract sales tax, GST or VAT from a price.',
    icon: ReceiptIcon,
    section: 'calculators',
  },
  {
    slug: 'interest-calculator',
    name: 'Simple & Compound Interest Calculator',
    description: 'Compare simple and compound interest earned on a principal over time.',
    icon: TrendingUpIcon,
    section: 'calculators',
  },
  {
    slug: 'bmr-calculator',
    name: 'BMR / Calorie Calculator',
    description: 'Estimate your basal metabolic rate and daily calorie needs.',
    icon: FlameIcon,
    section: 'calculators',
  },
  {
    slug: 'gpa-calculator',
    name: 'GPA Calculator',
    description: 'Calculate your grade point average from course grades and credits.',
    icon: GraduationCapIcon,
    section: 'calculators',
  },

  // --- Text & Data Conversion ---
  {
    slug: 'case-converter',
    name: 'Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, Title Case, camelCase and more.',
    icon: CaseIcon,
    section: 'text-data',
  },
  {
    slug: 'word-counter',
    name: 'Word & Character Counter',
    description: 'Count words, characters, sentences and estimated reading time.',
    icon: TextIcon,
    section: 'text-data',
  },
  {
    slug: 'base64-converter',
    name: 'Base64 Encoder / Decoder',
    description: 'Encode text to Base64 or decode Base64 back to readable text.',
    icon: CodeIcon,
    section: 'text-data',
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    description: 'Convert colors between HEX, RGB and HSL formats with a live preview.',
    icon: PaletteIcon,
    section: 'text-data',
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter & Validator',
    description: 'Pretty-print, minify and validate JSON with clear error messages.',
    icon: CodeIcon,
    section: 'text-data',
  },
  {
    slug: 'url-encoder-decoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode text for safe use in a URL, or decode a percent-encoded string.',
    icon: LinkIcon,
    section: 'text-data',
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    description: 'Generate placeholder paragraphs of Lorem Ipsum text.',
    icon: TextIcon,
    section: 'text-data',
  },
  {
    slug: 'text-diff-checker',
    name: 'Text Diff Checker',
    description: 'Compare two blocks of text and see what was added, removed or unchanged.',
    icon: DiffIcon,
    section: 'text-data',
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Turn any text, URL or contact info into a scannable QR code.',
    icon: QrCodeIcon,
    section: 'text-data',
  },
  {
    slug: 'qr-code-reader',
    name: 'QR Code Reader',
    description: 'Read a QR code from an image and copy the decoded text or link.',
    icon: QrCodeIcon,
    section: 'text-data',
  },
  {
    slug: 'barcode-creator',
    name: 'Barcode Creator',
    description: 'Create downloadable Code 128, EAN-13 or UPC-A barcodes from text or numbers.',
    icon: QrCodeIcon,
    section: 'text-data',
  },
  {
    slug: 'barcode-reader',
    name: 'Barcode Reader',
    description: 'Read a barcode from an image using your browser.',
    icon: QrCodeIcon,
    section: 'text-data',
  },
  {
    slug: 'text-line-tools',
    name: 'Text Line Tools',
    description: 'Find & replace, sort, and remove duplicate lines from a block of text.',
    icon: ListIcon,
    section: 'text-data',
  },

  // --- Numbers & Misc ---
  {
    slug: 'number-base-converter',
    name: 'Number Base Converter',
    description: 'Convert numbers between binary, octal, decimal and hexadecimal.',
    icon: BinaryIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'roman-numeral-converter',
    name: 'Roman Numeral Converter',
    description: 'Convert between numbers and Roman numerals in both directions.',
    icon: NumeralIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    description: 'Generate a strong, random password with customizable length and characters.',
    icon: KeyIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-1, SHA-256, SHA-384 or SHA-512 hashes from text.',
    icon: FingerprintIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate random RFC 4122 v4 UUIDs, one at a time or in bulk.',
    icon: IdCardIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'random-generator',
    name: 'Random Number / Dice / Coin Flip',
    description: 'Generate random numbers, roll dice, or flip a coin.',
    icon: DiceIcon,
    section: 'numbers-misc',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    description: 'Resize images by pixel dimensions or fit them within an aspect-ratio-based frame.',
    icon: ImageIcon,
    section: 'image-tools',
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.slug === slug);
}

export function getToolsBySection(section: Section): ToolDefinition[] {
  return TOOLS.filter((tool) => tool.section === section);
}

/** Curated shortlist spanning every section, surfaced as quick-access shortcuts on the homepage. */
export const POPULAR_TOOL_SLUGS = [
  'merge-pdf',
  'pdf-to-images',
  'currency-converter',
  'unit-converter',
  'bmi-calculator',
  'percentage-calculator',
  'word-counter',
  'qr-code-generator',
  'qr-code-reader',
  'barcode-creator',
  'image-resizer',
  'password-generator',
];

export function getPopularTools(): ToolDefinition[] {
  return POPULAR_TOOL_SLUGS.map((slug) => getToolBySlug(slug)).filter((tool): tool is ToolDefinition => Boolean(tool));
}

/** Simple case-insensitive search across every tool's name and description. */
export function searchTools(query: string): ToolDefinition[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return TOOLS.filter((tool) => tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q));
}
