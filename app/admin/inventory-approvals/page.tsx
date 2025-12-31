import { prisma } from "@/lib/prisma";
import ProductApprovalTable from "@/components/admin/product-approval-table";
export const dynamic = "force-dynamic";
export default async function InventoryApprovalsPage() {
    // 1. Fetch products that are NOT published yet
    const rawProducts = await prisma.product.findMany({
        where: {
            isPublished: false // This effectively acts as "Pending Approval"
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    // 2. Serialize data
    const products = rawProducts.map((p) => ({
        id: p.id,
        name: p.title, // Map 'title' from DB to 'name' for the table
        category: p.category,
        price: p.price,
        image: p.image,
        vendorId: p.vendorId,
        createdAt: p.createdAt.toISOString(),
    }));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Inventory Approvals</h1>
                <span className="text-sm text-muted-foreground">
                    {products.length} pending items
                </span>
            </div>

            <ProductApprovalTable initialProducts={products} />
        </div>
    );
}