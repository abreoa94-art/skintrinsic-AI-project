declare module 'html2canvas' {
  const html2canvas: (node: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  export default html2canvas;
}

declare module 'jspdf' {
  export class jsPDF {
    constructor(orientation?: any, unit?: any, format?: any);
    internal: { pageSize: { getWidth(): number; getHeight(): number } };
    addImage(imageData: string, format: 'PNG' | 'JPEG' | 'WEBP', x: number, y: number, width: number, height: number, alias?: string | undefined, compression?: 'FAST' | 'MEDIUM' | 'SLOW'): void;
    addPage(format?: string | string[], orientation?: 'p' | 'portrait' | 'l' | 'landscape'): void;
    save(filename: string): void;
  }
}

declare global {
  interface Window {
    html2canvas?: (node: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
    jsPDF?: any;
    jspdf?: { jsPDF: any };
  }
}
export {};
