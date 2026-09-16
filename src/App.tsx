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

const CurrencyConverter = lazy(() => import('./pages/tools/CurrencyConverter'));
const UnitConverter = lazy(() => import('./pages/tools/UnitConverter'));
const TemperatureConverter = lazy(() => import('./pages/tools/TemperatureConverter'));
const TimezoneConverter = lazy(() => import('./pages/tools/TimezoneConverter'));
const DateCalculator = lazy(() => import('./pages/tools/DateCalculator'));

const BmiCalculator = lazy(() => import('./pages/tools/BmiCalculator'));
const PercentageCalculator = lazy(() => import('./pages/tools/PercentageCalculator'));
const LoanCalculator = lazy(() => import('./pages/tools/LoanCalculator'));
const TipCalculator = lazy(() => import('./pages/tools/TipCalculator'));

const CaseConverter = lazy(() => import('./pages/tools/CaseConverter'));
const WordCounter = lazy(() => import('./pages/tools/WordCounter'));
const Base64Converter = lazy(() => import('./pages/tools/Base64Converter'));
const ColorConverter = lazy(() => import('./pages/tools/ColorConverter'));

const NumberBaseConverter = lazy(() => import('./pages/tools/NumberBaseConverter'));
const RomanNumeralConverter = lazy(() => import('./pages/tools/RomanNumeralConverter'));
const PasswordGenerator = lazy(() => import('./pages/tools/PasswordGenerator'));

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
            <Route path="/tools/merge-pdf" element={<MergePdf />} />
            <Route path="/tools/split-pdf" element={<SplitPdf />} />
            <Route path="/tools/delete-pages" element={<DeletePages />} />
            <Route path="/tools/rotate-pdf" element={<RotatePdf />} />
            <Route path="/tools/compress-pdf" element={<CompressPdf />} />
            <Route path="/tools/watermark-pdf" element={<WatermarkPdf />} />
            <Route path="/tools/page-numbers" element={<PageNumbers />} />
            <Route path="/tools/images-to-pdf" element={<ImagesToPdf />} />
            <Route path="/tools/pdf-to-images" element={<PdfToImages />} />

            <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
            <Route path="/tools/unit-converter" element={<UnitConverter />} />
            <Route path="/tools/temperature-converter" element={<TemperatureConverter />} />
            <Route path="/tools/timezone-converter" element={<TimezoneConverter />} />
            <Route path="/tools/date-calculator" element={<DateCalculator />} />

            <Route path="/tools/bmi-calculator" element={<BmiCalculator />} />
            <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />
            <Route path="/tools/loan-calculator" element={<LoanCalculator />} />
            <Route path="/tools/tip-calculator" element={<TipCalculator />} />

            <Route path="/tools/case-converter" element={<CaseConverter />} />
            <Route path="/tools/word-counter" element={<WordCounter />} />
            <Route path="/tools/base64-converter" element={<Base64Converter />} />
            <Route path="/tools/color-converter" element={<ColorConverter />} />

            <Route path="/tools/number-base-converter" element={<NumberBaseConverter />} />
            <Route path="/tools/roman-numeral-converter" element={<RomanNumeralConverter />} />
            <Route path="/tools/password-generator" element={<PasswordGenerator />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
