import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Premium from './pages/Premium';
import CategoryHub from './pages/CategoryHub';

const MergePdf = lazy(() => import('./pages/tools/MergePdf'));
const SplitPdf = lazy(() => import('./pages/tools/SplitPdf'));
const DeletePages = lazy(() => import('./pages/tools/DeletePages'));
const RotatePdf = lazy(() => import('./pages/tools/RotatePdf'));
const CompressPdf = lazy(() => import('./pages/tools/CompressPdf'));
const WatermarkPdf = lazy(() => import('./pages/tools/WatermarkPdf'));
const PageNumbers = lazy(() => import('./pages/tools/PageNumbers'));
const ImagesToPdf = lazy(() => import('./pages/tools/ImagesToPdf'));
const PdfToImages = lazy(() => import('./pages/tools/PdfToImages'));
const ExtractPdfText = lazy(() => import('./pages/tools/ExtractPdfText'));
const ExtractPdfImages = lazy(() => import('./pages/tools/ExtractPdfImages'));
const ReorderPdfPages = lazy(() => import('./pages/tools/ReorderPdfPages'));
const PdfMetadataEditor = lazy(() => import('./pages/tools/PdfMetadataEditor'));

const CurrencyConverter = lazy(() => import('./pages/tools/CurrencyConverter'));
const UnitConverter = lazy(() => import('./pages/tools/UnitConverter'));
const TemperatureConverter = lazy(() => import('./pages/tools/TemperatureConverter'));
const TimezoneConverter = lazy(() => import('./pages/tools/TimezoneConverter'));
const DateCalculator = lazy(() => import('./pages/tools/DateCalculator'));
const DataStorageConverter = lazy(() => import('./pages/tools/DataStorageConverter'));
const SpeedConverter = lazy(() => import('./pages/tools/SpeedConverter'));
const AreaConverter = lazy(() => import('./pages/tools/AreaConverter'));
const CookingMeasurementConverter = lazy(() => import('./pages/tools/CookingMeasurementConverter'));

const BmiCalculator = lazy(() => import('./pages/tools/BmiCalculator'));
const PercentageCalculator = lazy(() => import('./pages/tools/PercentageCalculator'));
const LoanCalculator = lazy(() => import('./pages/tools/LoanCalculator'));
const TipCalculator = lazy(() => import('./pages/tools/TipCalculator'));
const AgeCalculator = lazy(() => import('./pages/tools/AgeCalculator'));
const DiscountCalculator = lazy(() => import('./pages/tools/DiscountCalculator'));
const GstVatCalculator = lazy(() => import('./pages/tools/GstVatCalculator'));
const InterestCalculator = lazy(() => import('./pages/tools/InterestCalculator'));
const BmrCalculator = lazy(() => import('./pages/tools/BmrCalculator'));
const GpaCalculator = lazy(() => import('./pages/tools/GpaCalculator'));

const CaseConverter = lazy(() => import('./pages/tools/CaseConverter'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const Base64Converter = lazy(() => import('./pages/tools/Base64Converter'));
const ColorConverter = lazy(() => import('./pages/tools/ColorConverter'));
const JsonFormatter = lazy(() => import('./pages/tools/JsonFormatter'));
const UrlEncoderDecoder = lazy(() => import('./pages/tools/UrlEncoderDecoder'));
const LoremIpsumGenerator = lazy(() => import('./pages/tools/LoremIpsumGenerator'));
const TextDiffChecker = lazy(() => import('./pages/tools/TextDiffChecker'));
const QrCodeGenerator = lazy(() => import('./pages/tools/QrCodeGenerator'));
const QrCodeReader = lazy(() => import('./pages/tools/QrCodeReader'));
const BarcodeCreator = lazy(() => import('./pages/tools/BarcodeCreator'));
const BarcodeReader = lazy(() => import('./pages/tools/BarcodeReader'));
const TextLineTools = lazy(() => import('./pages/tools/TextLineTools'));
const OnlineNotepad = lazy(() => import('./pages/tools/OnlineNotepad'));
const TextFileMerger = lazy(() => import('./pages/tools/TextFileMerger'));

const NumberBaseConverter = lazy(() => import('./pages/tools/NumberBaseConverter'));
const RomanNumeralConverter = lazy(() => import('./pages/tools/RomanNumeralConverter'));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator'));
const HashGenerator = lazy(() => import('./pages/tools/HashGenerator'));
const UuidGenerator = lazy(() => import('./pages/tools/UuidGenerator'));
const RandomGenerator = lazy(() => import('./pages/tools/RandomGenerator'));
const ImageResizer = lazy(() => import('./pages/tools/ImageResizer'));
const ImageConverter = lazy(() => import('./pages/tools/ImageConverter'));
const ImageCompressor = lazy(() => import('./pages/tools/ImageCompressor'));

function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 text-slate-500">The tool you're looking for doesn't exist.</p>
    </div>
  );
}

function ToolFallback() {
  return <div className="mx-auto max-w-6xl px-4 py-16 text-center text-slate-400">Loading tool...</div>;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<ToolFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/pdf-toolkit" element={<CategoryHub section="pdf-toolkit" />} />
            <Route path="/everyday-conversions" element={<CategoryHub section="everyday-conversions" />} />
            <Route path="/calculators" element={<CategoryHub section="calculators" />} />
            <Route path="/text-data" element={<CategoryHub section="text-data" />} />
            <Route path="/numbers-misc" element={<CategoryHub section="numbers-misc" />} />
            <Route path="/image-tools" element={<CategoryHub section="image-tools" />} />
            <Route path="/scanning-codes" element={<CategoryHub section="scanning-codes" />} />
            <Route path="/developer-tools" element={<CategoryHub section="developer-tools" />} />
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/delete-pages" element={<DeletePages />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/watermark-pdf" element={<WatermarkPdf />} />
            <Route path="/tools/page-numbers" element={<PageNumbers />} />
            <Route path="/tools/images-to-pdf" element={<ImagesToPdf />} />
            <Route path="/tools/pdf-to-images" element={<PdfToImages />} />
            <Route path="/tools/extract-pdf-text" element={<ExtractPdfText />} />
            <Route path="/tools/extract-pdf-images" element={<ExtractPdfImages />} />
            <Route path="/tools/reorder-pdf-pages" element={<ReorderPdfPages />} />
            <Route path="/tools/pdf-metadata-editor" element={<PdfMetadataEditor />} />

            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
            <Route path="/tools/date-calculator" element={<DateCalculator />} />
            <Route path="/tools/data-storage-converter" element={<DataStorageConverter />} />
            <Route path="/tools/speed-converter" element={<SpeedConverter />} />
            <Route path="/tools/area-converter" element={<AreaConverter />} />
            <Route path="/tools/cooking-measurement-converter" element={<CookingMeasurementConverter />} />

            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />
            <Route path="/tools/age-calculator" element={<AgeCalculator />} />
            <Route path="/tools/discount-calculator" element={<DiscountCalculator />} />
            <Route path="/tools/gst-vat-calculator" element={<GstVatCalculator />} />
            <Route path="/tools/interest-calculator" element={<InterestCalculator />} />
            <Route path="/tools/bmr-calculator" element={<BmrCalculator />} />
            <Route path="/tools/gpa-calculator" element={<GpaCalculator />} />

            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/base64-converter" element={<Base64Converter />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />
            <Route path="/tools/json-formatter" element={<JsonFormatter />} />
            <Route path="/tools/url-encoder-decoder" element={<UrlEncoderDecoder />} />
            <Route path="/tools/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
            <Route path="/tools/text-diff-checker" element={<TextDiffChecker />} />
            <Route path="/tools/qr-code-generator" element={<QrCodeGenerator />} />
            <Route path="/tools/qr-code-reader" element={<QrCodeReader />} />
            <Route path="/tools/barcode-creator" element={<BarcodeCreator />} />
            <Route path="/tools/barcode-reader" element={<BarcodeReader />} />
            <Route path="/tools/text-line-tools" element={<TextLineTools />} />
            <Route path="/tools/online-notepad" element={<OnlineNotepad />} />
            <Route path="/tools/text-file-merger" element={<TextFileMerger />} />

            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tools/roman-numeral-converter" element={<RomanNumeralConverter />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />
            <Route path="/tools/hash-generator" element={<HashGenerator />} />
            <Route path="/tools/uuid-generator" element={<UuidGenerator />} />
            <Route path="/tools/random-generator" element={<RandomGenerator />} />
            <Route path="/tools/image-resizer" element={<ImageResizer />} />
            <Route path="/tools/image-converter" element={<ImageConverter />} />
            <Route path="/tools/image-compressor" element={<ImageCompressor />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
