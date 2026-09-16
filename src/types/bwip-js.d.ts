declare module 'bwip-js' {
  interface BarcodeOptions {
    bcid: string;
    text: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
    backgroundcolor?: string;
  }

  const bwipjs: {
    toCanvas(canvas: HTMLCanvasElement, options: BarcodeOptions): Promise<void>;
  };

  export default bwipjs;
}