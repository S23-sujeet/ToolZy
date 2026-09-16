import { useMemo, useState } from 'react';
import ToolLayout from '../../components/ToolLayout';
import { PaletteIcon } from '../../components/icons';
import { parseHexColor, rgbToHex, rgbToHsl } from '../../lib/colorTools';

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

export default function ColorConverter() {
  const [hex, setHex] = useState('#3366FF');

  const { rgb, hsl, error } = useMemo(() => {
    try {
      const parsed = parseHexColor(hex);
      return { rgb: parsed, hsl: rgbToHsl(parsed), error: null };
    } catch (err) {
      return { rgb: null, hsl: null, error: err instanceof Error ? err.message : 'Invalid color.' };
    }
  }, [hex]);

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB and HSL formats with a live preview."
      seoDescription="Free color converter. Convert HEX colors to RGB and HSL with a live color preview, right in your browser."
      path="/tools/color-converter"
      icon={PaletteIcon}
    >
      <label className="block text-sm font-medium text-slate-700">
        HEX color
        <input
          type="text"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#3366FF"
          className={inputClass}
        />
      </label>

      <div className="mt-4 flex items-center gap-2">
        <input
          type="color"
          value={rgb ? rgbToHex(rgb) : '#000000'}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-14 cursor-pointer rounded-lg border border-slate-300"
        />
        <span className="text-sm text-slate-500">Pick a color visually</span>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : (
          rgb &&
          hsl && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 shadow-sm"
                style={{ backgroundColor: rgbToHex(rgb) }}
              />
              <div className="space-y-1 text-sm">
                <p className="font-mono text-slate-800">HEX: {rgbToHex(rgb)}</p>
                <p className="font-mono text-slate-800">
                  RGB: rgb({rgb.r}, {rgb.g}, {rgb.b})
                </p>
                <p className="font-mono text-slate-800">
                  HSL: hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </ToolLayout>
  );
}
