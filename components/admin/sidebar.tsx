import Link from "next/link";
import { LayoutDashboard, Package, Users, Store, History } from "lucide-react";
import { Tags } from "lucide-react"; // Import a 'Tag' icon

export default function AdminSidebar() {
    return (
        <aside className="w-64 border-r bg-background">
            <div className="p-6 font-bold text-lg">Fixkart Admin</div>

            <nav className="px-4 space-y-2">
                <Link
                    href="/admin"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </Link>

                <Link
                    href="/admin/orders"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                    <Package size={18} />
                    Orders
                </Link>

                <Link
                    href="/admin/orders-history"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors"
                >
                    <History size={18} />
                    Order History
                </Link>

                <Link
                    href="/admin/vendors"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                    <Store size={18} />
                    Vendors
                </Link>
                <Link
                    href="/admin/onboarded-vendors"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                    <Store size={18} />
                    Onboarded Vendors
                </Link>

                <Link
                    href="/admin/inventory-approvals"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted transition-colors"
                >
                    <Package size={18} />
                    Inventory Approvals
                </Link>




                <Link
                    href="/admin/users"
                    className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted"
                >
                    <Users size={18} />
                    Users
                </Link>
            </nav>
        </aside>
    );
}
