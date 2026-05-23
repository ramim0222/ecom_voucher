"use client";

import { useState } from "react";
import { AdminLayout } from "@/Components/Admin/AdminLayout";
import { PageHead } from "@/Components/PageHead";
import { GamingButton } from "@/Components/ui/GamingButton";
import { ProductsTable } from "@/Components/Admin/ProductsTable";
import { ProductModal } from "@/Components/Admin/ProductModal";
import CodeUploadModal from "@/Components/Admin/CodeUploadModal";
import ViewCodesModal from "@/Components/Admin/ViewCodesModal";
import { router } from "@inertiajs/react";
import {
    formatValidationErrors,
    useToast,
} from "@/Components/Admin/ToastProvider";

export default function AdminProducts({
    products = { data: [] },
    categories = [],
}) {
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalErrors, setModalErrors] = useState({});
    const [editingProduct, setEditingProduct] = useState(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [selectedProductForCodes, setSelectedProductForCodes] =
        useState(null);
    const [isViewCodesModalOpen, setIsViewCodesModalOpen] = useState(false);
    const [selectedProductForViewing, setSelectedProductForViewing] =
        useState(null);

    const handleAddProduct = () => {
        setEditingProduct(null);
        setModalErrors({});
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setModalErrors({});
        setIsModalOpen(true);
    };

    const handleAddCode = (product) => {
        setSelectedProductForCodes(product);
        setIsCodeModalOpen(true);
    };

    const handleViewCodes = (product) => {
        setSelectedProductForViewing(product);
        setIsViewCodesModalOpen(true);
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
        formData.append("is_featured", productData.is_featured ? "1" : "0");
        formData.append("sort_order", productData.sort_order || "0");

        // Handle features array
        if (productData.features && Array.isArray(productData.features)) {
            productData.features.forEach((feature, index) => {
                formData.append(`features[${index}]`, feature);
            });
        }

        // Handle file upload
        if (productData.product_image) {
            formData.append("product_image", productData.product_image);
        }

        if (editingProduct) {
            // Update existing product - use POST with _method PUT for file uploads
            formData.append("_method", "PUT");
            router.post(`/admin/products/${editingProduct.id}`, formData, {
                onSuccess: () => {
                    setModalErrors({});
                    setIsModalOpen(false);
                    setEditingProduct(null);
                },
                onError: (errors) => {
                    setModalErrors(errors);
                    addToast(formatValidationErrors(errors), "error");
                },
            });
        } else {
            // Create new product
            router.post("/admin/products", formData, {
                onSuccess: () => {
                    setModalErrors({});
                    setIsModalOpen(false);
                },
                onError: (errors) => {
                    setModalErrors(errors);
                    addToast(formatValidationErrors(errors), "error");
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
                    addToast(formatValidationErrors(errors), "error");
                },
            });
        }
    };

    const handleProcessCodes = (codes, product) => {
        console.log("Processing codes for product:", product);
        console.log("Codes:", codes);

        // Save codes to the database
        router.post(
            `/admin/products/${product.id}/codes`,
            { codes: codes },
            {
                onSuccess: () => {
                    setIsCodeModalOpen(false);
                    setSelectedProductForCodes(null);
                    // Refresh the page to show updated stock counts
                    router.reload({ only: ["products"] });
                },
                onError: (errors) => {
                    addToast(formatValidationErrors(errors), "error");
                },
            }
        );
    };

    const handleCloseCodeModal = () => {
        setIsCodeModalOpen(false);
        setSelectedProductForCodes(null);
    };

    const handleCloseViewCodesModal = () => {
        setIsViewCodesModalOpen(false);
        setSelectedProductForViewing(null);
    };

    return (
        <AdminLayout>
            <PageHead title="Products Management" />
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
                    products={products.data ?? []}
                    onEdit={handleEditProduct}
                    onAddCode={handleAddCode}
                    onViewCodes={handleViewCodes}
                    onDelete={handleDeleteProduct}
                />

                {products.links && products.links.length > 1 && (
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border border-slate-700">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-slate-400 text-sm">
                                {products.from && products.to && products.total ? (
                                    <>
                                        Showing {products.from} to {products.to} of{" "}
                                        {products.total} products
                                    </>
                                ) : null}
                            </div>
                            <div className="flex items-center justify-center gap-2 flex-wrap">
                                {products.prev_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(products.prev_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-slate-300"
                                    >
                                        Previous
                                    </GamingButton>
                                )}

                                {products.links.map((link, index) => {
                                    if (
                                        link.label === "&laquo; Previous" ||
                                        link.label === "Next &raquo;"
                                    ) {
                                        return null;
                                    }

                                    return (
                                        <GamingButton
                                            key={index}
                                            variant={
                                                link.active ? "primary" : "ghost"
                                            }
                                            size="sm"
                                            onClick={() => {
                                                if (link.url) {
                                                    router.visit(link.url, {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    });
                                                }
                                            }}
                                            disabled={!link.url}
                                            className={
                                                link.active
                                                    ? ""
                                                    : "text-slate-300"
                                            }
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </GamingButton>
                                    );
                                })}

                                {products.next_page_url && (
                                    <GamingButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            router.visit(products.next_page_url, {
                                                preserveState: true,
                                                preserveScroll: true,
                                            })
                                        }
                                        className="text-slate-300"
                                    >
                                        Next
                                    </GamingButton>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setModalErrors({});
                    }}
                    product={editingProduct}
                    categories={categories}
                    errors={modalErrors}
                    onSave={handleSaveProduct}
                />

                <CodeUploadModal
                    isOpen={isCodeModalOpen}
                    onClose={handleCloseCodeModal}
                    product={selectedProductForCodes}
                    onProcessCodes={handleProcessCodes}
                />

                <ViewCodesModal
                    isOpen={isViewCodesModalOpen}
                    onClose={handleCloseViewCodesModal}
                    product={selectedProductForViewing}
                />
            </div>
        </AdminLayout>
    );
}
