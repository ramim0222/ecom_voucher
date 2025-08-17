"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductsTable } from "@/Components/Admin/ProductsTable";
import { ProductModal } from "@/Components/Admin/ProductModal";
import CodeUploadModal from "@/Components/Admin/CodeUploadModal";
import { router } from "@inertiajs/react";

export default function AdminProducts({ products = [], categories = [] }) {
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

    const handleSaveProduct = (productData) => {
        const formData = new FormData();

        // Append all the form data fields
        formData.append("title", productData.title);
        formData.append("category_id", productData.category_id);
        formData.append("status", productData.status);
        formData.append("price", productData.price);
        formData.append("original_price", productData.original_price || "");
        formData.append("buying_price", productData.buying_price);
        formData.append("description", productData.description || "");
        formData.append("total_codes", productData.total_codes || "0");
        formData.append("sold_codes", productData.sold_codes || "0");
        formData.append("is_featured", productData.is_featured ? "1" : "0");
        formData.append("sort_order", productData.sort_order || "0");

        // Handle file upload
        if (productData.product_image) {
            formData.append("product_image", productData.product_image);
        }

        if (editingProduct) {
            // Update existing product - use POST with _method PUT for file uploads
            formData.append("_method", "PUT");
            router.post(`/admin/products/${editingProduct.id}`, formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    setEditingProduct(null);
                },
                onError: (errors) => {
                    console.error("Update failed:", errors);
                    alert(
                        "Failed to update product. Please check the form and try again."
                    );
                },
            });
        } else {
            // Create new product
            router.post("/admin/products", formData, {
                onSuccess: () => {
                    setIsModalOpen(false);
                },
                onError: (errors) => {
                    console.error("Create failed:", errors);
                    alert(
                        "Failed to create product. Please check the form and try again."
                    );
                },
            });
        }
    };

    const handleDeleteProduct = (productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            router.delete(`/admin/products/${productId}`, {
                onSuccess: () => {
                    // Product deleted successfully
                },
                onError: (errors) => {
                    console.error("Delete failed:", errors);
                },
            });
        }
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
                    products={products}
                    onEdit={handleEditProduct}
                    onAddCode={handleAddCode}
                    onDelete={handleDeleteProduct}
                />

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    product={editingProduct}
                    categories={categories}
                    onSave={handleSaveProduct}
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
