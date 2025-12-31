import { prisma } from "@/lib/prisma";
import OrdersTable from "@/components/admin/orders-table";
export const dynamic = "force-dynamic";
export default async function OrdersPage() {

    // 1. Fetch PENDING orders from Database
    const rawOrders = await prisma.order.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            items: true, // We include items to display them in details
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 2. Clean data for the client (Added email, phone, and full items)
    const orders = rawOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail, // Added
        customerPhone: order.customerPhone, // Added
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items, // Pass the full items array
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Pending Orders</h1>
                <span className="text-sm text-muted-foreground">
                    {orders.length} requiring attention
                </span>
            </div>

            <OrdersTable initialOrders={orders} />
        </div>
    );
}