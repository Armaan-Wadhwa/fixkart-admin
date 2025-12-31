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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Truck, CheckCircle, XCircle, Package, Loader2 } from "lucide-react";
import OrderDetailsDialog, { OrderDetails } from "@/components/admin/order-details-dialog";

export default function OrderHistoryTable({ initialOrders }: { initialOrders: OrderDetails[] }) {
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleStatusChange = async (id: string, newStatus: any) => {
        setUpdatingId(id);
        const result = await updateOrderStatus(id, newStatus);
        setUpdatingId(null);

        if (!result.success) {
            alert("Failed to update status");
        }
    };

    // Helper to color-code statuses
    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200";
            case "SHIPPED": return "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200";
            case "DELIVERED": return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
            case "COMPLETED": return "bg-green-100 text-green-700 hover:bg-green-100 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            case "CANCELLED": return "bg-red-100 text-red-700 hover:bg-red-100 border-red-200";
            default: return "bg-gray-100 text-gray-700 hover:bg-gray-100";
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
                        <TableHead>Status (Click to Edit)</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {initialOrders.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                No order history found.
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

                                {/* Status Column with Dropdown */}
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="h-auto p-0 hover:bg-transparent"
                                                disabled={updatingId === order.id}
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className={`${getStatusColor(order.status)} cursor-pointer flex items-center gap-1 pr-1`}
                                                >
                                                    {updatingId === order.id ? (
                                                        <Loader2 className="h-3 w-3 animate-spin" />
                                                    ) : (
                                                        order.status
                                                    )}
                                                    <ChevronDown className="h-3 w-3 opacity-50" />
                                                </Badge>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "SHIPPED")}>
                                                <Truck className="mr-2 h-4 w-4 text-purple-600" />
                                                Mark Shipped
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "DELIVERED")}>
                                                <Package className="mr-2 h-4 w-4 text-blue-600" />
                                                Mark Delivered
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "COMPLETED")}>
                                                <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                                Mark Completed
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem onClick={() => handleStatusChange(order.id, "CANCELLED")}>
                                                <XCircle className="mr-2 h-4 w-4 text-red-600" />
                                                Cancel Order
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>

                                <TableCell className="text-muted-foreground text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="text-right">
                                    <OrderDetailsDialog order={order} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}