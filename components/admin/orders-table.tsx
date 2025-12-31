"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/admin/confirm-dialog";
import OrderDetailsDialog, { OrderDetails } from "@/components/admin/order-details-dialog";

// We use the 'OrderDetails' type exported from our dialog component
// so the data structure matches perfectly.
export default function OrdersTable({ initialOrders }: { initialOrders: OrderDetails[] }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED") => {
        setIsLoading(true);
        const result = await updateOrderStatus(id, newStatus);
        setIsLoading(false);

        if (!result.success) {
            alert("Failed to update order");
        }
    };

    return (
        <div className="rounded-md border bg-background">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {initialOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No pending orders found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        initialOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium text-xs">
                                    {order.id.slice(-6).toUpperCase()}
                                </TableCell>
                                <TableCell>
                                    <div className="font-medium">{order.customerName}</div>
                                    <div className="text-xs text-muted-foreground">
                                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                    </div>
                                </TableCell>
                                <TableCell>₹{order.totalAmount.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {order.status}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {/* 1. View Details Button (New) */}
                                        <OrderDetailsDialog order={order} />

                                        {/* 2. Approve Button */}
                                        <ConfirmDialog
                                            title="Approve Order"
                                            description="This will mark the order as processing."
                                            toastTitle="Order Approved"
                                            toastDescription="Order status updated."
                                            onConfirm={() => handleStatusUpdate(order.id, "APPROVED")}
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 text-white h-8"
                                                    disabled={isLoading}
                                                >
                                                    Approve
                                                </Button>
                                            }
                                        />

                                        {/* 3. Reject Button */}
                                        <ConfirmDialog
                                            title="Reject Order"
                                            description="This will cancel the order."
                                            toastTitle="Order Rejected"
                                            toastDescription="Order has been cancelled."
                                            variant="destructive"
                                            onConfirm={() => handleStatusUpdate(order.id, "REJECTED")}
                                            trigger={
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    className="h-8"
                                                    disabled={isLoading}
                                                >
                                                    Reject
                                                </Button>
                                            }
                                        />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}