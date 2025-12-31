"use client";

import { useState } from "react";
import { approveProduct, rejectProduct } from "@/app/admin/actions";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/admin/confirm-dialog";

type ProductRequest = {
    id: string;
    name: string;
    category: string;
    price: number;
    image: string;
    vendorId: string; // Used to identify owner
    createdAt: string;
};

export default function ProductApprovalTable({ initialProducts }: { initialProducts: ProductRequest[] }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = async (id: string, action: "APPROVE" | "REJECT") => {
        setIsLoading(true);
        const result = action === "APPROVE"
            ? await approveProduct(id)
            : await rejectProduct(id);

        setIsLoading(false);
        if (!result.success) alert("Action failed");
    };

    return (
        <div className="rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Date Added</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {initialProducts.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No new products waiting for approval.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialProducts.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <div className="h-12 w-12 rounded border bg-muted overflow-hidden">
                                        {/* Display Image */}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">
                                    {product.name}
                                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">
                                        ID: {product.id.slice(-6)}
                                    </div>
                                </TableCell>
                                <TableCell className="capitalize">{product.category}</TableCell>
                                <TableCell>₹{product.price.toFixed(2)}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(product.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="text-right space-x-2">
                                    <ConfirmDialog
                                        title="Approve Product?"
                                        description="This item will effectively go LIVE on the website."
                                        toastTitle="Product Published"
                                        toastDescription="Item is now visible to customers."
                                        onConfirm={() => handleAction(product.id, "APPROVE")}
                                        trigger={
                                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
                                                Approve
                                            </Button>
                                        }
                                    />

                                    <ConfirmDialog
                                        title="Reject Product?"
                                        description="This will permanently delete this product draft."
                                        toastTitle="Product Rejected"
                                        toastDescription="Draft deleted."
                                        variant="destructive"
                                        onConfirm={() => handleAction(product.id, "REJECT")}
                                        trigger={
                                            <Button size="sm" variant="destructive" disabled={isLoading}>
                                                Reject
                                            </Button>
                                        }
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}