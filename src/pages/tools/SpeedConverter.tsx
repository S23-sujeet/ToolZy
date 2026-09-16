import ToolLayout from '../../components/ToolLayout';
import SingleUnitConverter from '../../components/SingleUnitConverter';
import { SpeedIcon } from '../../components/icons';

export default function SpeedConverter() {
  return (
    <ToolLayout
      title="Speed Converter"
      description="Convert between km/h, mph, m/s, knots and ft/s."
      seoDescription="Free speed converter. Convert between kilometers per hour, miles per hour, meters per second, knots and feet per second instantly."
      path="/tools/speed-converter"
      icon={SpeedIcon}
    >
      <SingleUnitConverter type="speed" defaultFrom="kmh" defaultTo="mph" />
    </ToolLayout>
  );
}
