import { prisma } from "@/lib/prisma";
import OrderHistoryTable from "@/components/admin/order-history-table";
import TableSearch from "@/components/admin/table-search"; // Import the new search bar
export const dynamic = "force-dynamic";
// 1. Accept searchParams as a prop
export default async function OrderHistoryPage({
    searchParams,
}: {
    searchParams: Promise<{ query?: string }>;
}) {
    // 2. Await params (Next.js 15 requirement)
    const params = await searchParams;
    const query = params.query || "";

    // 3. Build the Prisma Filter
    // We want orders that are NOT pending AND match the search query
    const whereClause: any = {
        status: { not: "PENDING" },
    };

    if (query) {
        whereClause.OR = [
            { id: { contains: query, mode: "insensitive" } },           // Search by Order ID
            { customerName: { contains: query, mode: "insensitive" } }, // Search by Name
            { customerEmail: { contains: query, mode: "insensitive" } } // Search by Email
        ];
    }

    // 4. Fetch filtered data
    const rawOrders = await prisma.order.findMany({
        where: whereClause,
        include: {
            items: true,
        },
        orderBy: {
            updatedAt: 'desc'
        }
    });

    // 5. Clean data for client
    const orders = rawOrders.map((order) => ({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.updatedAt.toISOString(),
        items: order.items,
    }));

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Order History</h1>
                    <span className="text-sm text-muted-foreground">
                        {orders.length} {query ? 'results found' : 'past orders'}
                    </span>
                </div>

                {/* 6. Add the Search Bar */}
                <TableSearch placeholder="Search ID, Customer, Email..." />
            </div>

            <OrderHistoryTable initialOrders={orders} />
        </div>
    );
}