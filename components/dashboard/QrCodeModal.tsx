import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { X, Download } from 'lucide-react';
import { urlApi } from '@/lib/api';

interface QrCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    shortUrl: string;
    isQRActivated: boolean;
}

const QrCodeModal: React.FC<QrCodeModalProps> = ({ isOpen, onClose, shortUrl, isQRActivated }) => {
    const svgRef = useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen && !isQRActivated) {
            urlApi.generateQR(shortUrl).catch(err => console.error("Failed to register QR stats", err));
        }
    }, [isOpen, shortUrl, isQRActivated]);

    if (!isOpen) return null;

    const downloadQRCode = () => {
        if (!svgRef.current) return;

        const svg = svgRef.current.querySelector("svg");
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            if (ctx) {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = `qrcode-${shortUrl.split('/').pop()}.png`;
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/90 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
            <div className="relative bg-white p-8 md:p-12 rounded-3xl w-full max-w-sm flex flex-col items-center gap-8 shadow-2xl scale-95 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-black/20 hover:text-black transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-black uppercase tracking-widest">QR Code</h3>
                    <p className="text-xs text-black/40 break-all max-w-[200px] mx-auto">{shortUrl}</p>
                </div>

                <div className="p-4 bg-white" ref={svgRef}>
                    <QRCode
                        value={shortUrl}
                        size={200}
                        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                        viewBox={`0 0 256 256`}
                    />
                </div>

                <button
                    onClick={downloadQRCode}
                    className="w-full py-4 bg-black text-white font-bold rounded-xl hover:opacity-80 transition-opacity uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                >
                    <Download size={14} />
                    Download PNG
                </button>
            </div>
        </div>
    );
};

export default QrCodeModal;
