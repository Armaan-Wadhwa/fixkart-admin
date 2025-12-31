// app/admin/actions.ts
'use server'

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { clerkClient } from "@clerk/nextjs/server";

// --- VENDOR ACTIONS ---
export async function updateVendorStatus(vendorId: string, newStatus: "APPROVED" | "SUSPENDED" | "REJECTED" | "PENDING") {
    try {
        await prisma.vendorProfile.update({
            where: { id: vendorId },
            data: { status: newStatus }
        })

        // Refresh the page data automatically
        revalidatePath("/admin/onboarded-vendors")
        revalidatePath("/admin/vendors") // Refresh the pending list too
        return { success: true }
    } catch (error) {
        console.error("Failed to update status:", error)
        return { success: false, error: "Database update failed" }
    }
}

// --- INVENTORY APPROVAL ACTIONS ---
export async function approveProduct(productId: string) {
    try {
        await prisma.product.update({
            where: { id: productId },
            data: { isPublished: false }, // Make it live
        });
        revalidatePath("/admin/inventory-approvals");
        return { success: true };
    } catch (error) {
        console.error("Failed to approve product:", error);
        return { success: false, error: "Database update failed" };
    }
}

export async function rejectProduct(productId: string) {
    try {
        // Rejection usually means deleting the draft or keeping it hidden.
        // Here we will DELETE it to keep the database clean.
        await prisma.product.delete({
            where: { id: productId },
        });
        revalidatePath("/admin/inventory-approvals");
        return { success: true };
    } catch (error) {
        console.error("Failed to reject product:", error);
        return { success: false, error: "Database update failed" };
    }
}

// --- ORDER ACTIONS ---
export async function updateOrderStatus(
    orderId: string,
    newStatus: "APPROVED" | "REJECTED" | "SHIPPED" | "DELIVERED" | "COMPLETED" | "CANCELLED"
) {
    try {
        await prisma.order.update({
            where: { id: orderId },
            data: { status: newStatus }
        })

        // Refresh both pages so the data is accurate everywhere
        revalidatePath("/admin/orders")
        revalidatePath("/admin/orders-history")

        return { success: true }
    } catch (error) {
        console.error("Failed to update order:", error)
        return { success: false, error: "Database update failed" }
    }
}

// --- USER ACTIONS ---
export async function toggleUserBan(userId: string, shouldBan: boolean) {
    try {
        const client = await clerkClient();

        if (shouldBan) {
            await client.users.banUser(userId);
        } else {
            await client.users.unbanUser(userId);
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Failed to toggle ban status:", error);
        return { success: false, error: "Failed to update user status" };
    }
}