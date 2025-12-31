"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import AdminSidebar from "@/components/admin/sidebar";
import AdminNavbar from "@/components/admin/navbar";
import AdminBreadcrumbs from "@/components/admin/breadcrumbs";
import { VendorProvider } from "@/components/admin/vendor-context";

const ADMIN_EMAIL = "jka8685@gmail.com";
export const dynamic = "force-dynamic";
export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoaded) return;

        if (!user) {
            router.replace("/sign-in");
            return;
        }

        const email = user.primaryEmailAddress?.emailAddress;
        if (email !== ADMIN_EMAIL) {
            router.replace("/unauthorized");
        }
    }, [user, isLoaded, router]);

    if (!isLoaded) return null;

    return (
        <VendorProvider>
            <div className="flex min-h-screen">
                <AdminSidebar />

                <div className="flex-1 flex flex-col">
                    <AdminNavbar />

                    <div className="px-6 py-3 bg-background border-b">
                        <AdminBreadcrumbs />
                    </div>

                    <main className="flex-1 p-6 bg-muted/40">
                        {children}
                    </main>
                </div>
            </div>
        </VendorProvider>
    );
}
