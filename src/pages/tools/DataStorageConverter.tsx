import ToolLayout from '../../components/ToolLayout';
import SingleUnitConverter from '../../components/SingleUnitConverter';
import { StorageIcon } from '../../components/icons';

export default function DataStorageConverter() {
  return (
    <ToolLayout
      title="Data Storage Converter"
      description="Convert between bits, bytes, KB, MB, GB, TB and PB."
      seoDescription="Free data storage converter. Convert between bits, bytes, kilobytes, megabytes, gigabytes, terabytes and petabytes instantly."
      path="/tools/data-storage-converter"
      icon={StorageIcon}
    >
      <SingleUnitConverter type="digital" defaultFrom="gb" defaultTo="mb" />
    </ToolLayout>
  );
}
