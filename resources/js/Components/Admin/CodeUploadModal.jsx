"use client";

import { useState, useRef } from "react";
import { GamingButton } from "@/Components/ui/GamingButton";

export default function CodeUploadModal({
    isOpen,
    onClose,
    product,
    onProcessCodes,
}) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [processedCodes, setProcessedCodes] = useState([]);
    const [errors, setErrors] = useState({});
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validate file type
            if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
                setErrors({ file: "Please select a valid text file (.txt)" });
                setSelectedFile(null);
                return;
            }

            setErrors({});
            setSelectedFile(file);
            setProcessedCodes([]);
        }
    };

    const processTextFile = async () => {
        if (!selectedFile) {
            setErrors({ file: "Please select a file first" });
            return;
        }

        setIsProcessing(true);
        setErrors({});

        try {
            const text = await selectedFile.text();
            const codes = text
                .split("\n")
                .map((code) => code.trim())
                .filter((code) => code.length > 0);

            if (codes.length === 0) {
                setErrors({ file: "No valid codes found in the file" });
                return;
            }

            setProcessedCodes(codes);

            // Call the parent callback with processed codes
            if (onProcessCodes) {
                onProcessCodes(codes, product);
            }
        } catch (error) {
            setErrors({ file: "Error processing file. Please try again." });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setProcessedCodes([]);
        setErrors({});
        onClose();
    };

    const removeFile = () => {
        setSelectedFile(null);
        setProcessedCodes([]);
        setErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                            <span className="text-orange-400 text-xl">📁</span>
                        </div>
                        <h2 className="font-heading font-bold text-xl text-white">
                            Upload Voucher Codes
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-slate-400 hover:text-white text-xl transition-colors"
                    >
                        ×
                    </button>
                </div>

                {product && (
                    <div className="mb-6 p-4 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <h3 className="font-semibold text-orange-400 mb-2">
                            Product Details
                        </h3>
                        <p className="text-slate-300">
                            <span className="font-medium text-orange-300">
                                Name:
                            </span>{" "}
                            {product.name}
                        </p>
                        <p className="text-slate-300">
                            <span className="font-medium text-orange-300">
                                Category:
                            </span>{" "}
                            {product.category}
                        </p>
                    </div>
                )}

                <div className="space-y-6">
                    {/* File Upload Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">
                            Select Text File
                        </label>
                        <div className="mt-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                id="file"
                                accept=".txt,text/plain"
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <div className="flex items-center space-x-4">
                                <GamingButton
                                    variant="secondary"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Choose File
                                </GamingButton>
                                {selectedFile && (
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-slate-300 bg-slate-700/50 px-3 py-1 rounded-md">
                                            {selectedFile.name}
                                        </span>
                                        <button
                                            onClick={removeFile}
                                            className="text-red-400 hover:text-red-300 p-1"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {errors.file && (
                            <p className="text-red-400 text-sm mt-2">
                                {errors.file}
                            </p>
                        )}
                    </div>

                    {/* Process Button */}
                    <div>
                        <GamingButton
                            variant="primary"
                            onClick={processTextFile}
                            disabled={!selectedFile || isProcessing}
                            size="lg"
                            className="w-full"
                        >
                            {isProcessing ? (
                                <div className="flex items-center justify-center space-x-2">
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    <span>Processing...</span>
                                </div>
                            ) : (
                                "Process Text File"
                            )}
                        </GamingButton>
                    </div>

                    {/* Results Section */}
                    {processedCodes.length > 0 && (
                        <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/10">
                            <h3 className="font-semibold text-green-400 mb-3">
                                ✅ Processing Complete! ({processedCodes.length}{" "}
                                codes found)
                            </h3>
                            <div className="max-h-40 overflow-y-auto">
                                <div className="grid grid-cols-3 gap-2">
                                    {processedCodes.map((code, index) => (
                                        <div
                                            key={index}
                                            className="bg-slate-700/50 px-3 py-2 rounded text-sm font-mono text-slate-200 border border-slate-600"
                                        >
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm text-green-300 mt-3">
                                These codes have been processed and are ready to
                                be saved.
                            </p>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                        <h3 className="font-semibold text-slate-200 mb-2">
                            📋 Instructions
                        </h3>
                        <ul className="text-sm text-slate-300 space-y-1">
                            <li>
                                • Upload a .txt file containing voucher codes
                            </li>
                            <li>• Each code should be on a separate line</li>
                            <li>
                                • Empty lines will be automatically filtered out
                            </li>
                            <li>
                                • Click "Process Text File" to extract the codes
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 mt-6 border-t border-slate-700">
                    <GamingButton
                        variant="ghost"
                        onClick={handleClose}
                        className="flex-1 text-slate-300"
                    >
                        Cancel
                    </GamingButton>
                    {processedCodes.length > 0 && (
                        <GamingButton
                            variant="primary"
                            size="lg"
                            onClick={() => {
                                // Here you would typically save the codes to database
                                console.log("Saving codes:", processedCodes);
                                handleClose();
                            }}
                            className="flex-1"
                        >
                            Save Codes
                        </GamingButton>
                    )}
                </div>
            </div>
        </div>
    );
}
