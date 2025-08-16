"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductsTable } from "@/Components/Admin/ProductsTable";
import { ProductModal } from "@/Components/Admin/ProductModal";
import CodeUploadModal from "@/Components/Admin/CodeUploadModal";

export default function AdminProducts() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [selectedProductForCodes, setSelectedProductForCodes] =
        useState(null);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleAddCode = (product) => {
        setSelectedProductForCodes(product);
        setIsCodeModalOpen(true);
    };

    const handleProcessCodes = (codes, product) => {
        console.log("Processing codes for product:", product);
        console.log("Codes:", codes);
        // Here you would typically save the codes to the database
        // For now, we'll just log them
    };

    const handleCloseCodeModal = () => {
        setIsCodeModalOpen(false);
        setSelectedProductForCodes(null);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="font-heading font-bold text-3xl mb-2">
                            Products Management
                        </h1>
                        <p className="text-muted-foreground">
                            Manage your gaming voucher inventory
                        </p>
                    </div>
                    <GamingButton
                        variant="primary"
                        size="lg"
                        onClick={handleAddProduct}
                    >
                        Add New Product
                    </GamingButton>
                </div>

                <ProductsTable
                    onEdit={handleEditProduct}
                    onAddCode={handleAddCode}
                />

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={editingProduct}
                />

                <CodeUploadModal
                    isOpen={isCodeModalOpen}
                    onClose={handleCloseCodeModal}
                    product={selectedProductForCodes}
                    onProcessCodes={handleProcessCodes}
                />
            </div>
        </AdminLayout>
    );
}
