import ToolLayout from '../../components/ToolLayout';
import SingleUnitConverter from '../../components/SingleUnitConverter';
import { AreaIcon } from '../../components/icons';

export default function AreaConverter() {
  return (
    <ToolLayout
      title="Area Converter"
      description="Convert between square meters, square feet, acres, hectares and more."
      seoDescription="Free area converter. Convert between square meters, square feet, square yards, acres, hectares and square miles instantly."
      path="/tools/area-converter"
      icon={AreaIcon}
    >
      <SingleUnitConverter type="area" defaultFrom="sqm" defaultTo="sqft" />
    </ToolLayout>
  );
}
