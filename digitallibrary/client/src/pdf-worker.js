import { pdfjs } from 'react-pdf';

// Use local worker file for offline usage
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.js';

export default pdfjs; 