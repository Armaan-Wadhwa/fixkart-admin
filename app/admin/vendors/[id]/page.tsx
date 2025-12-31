import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const dynamic = "force-dynamic";
// 1. FIX: Update type to Promise<{ id: string }>
export default async function VendorDetailsPage({ params }: { params: Promise<{ id: string }> }) {

    // 2. FIX: Await params before accessing the ID
    const { id } = await params;

    // 3. Fetch the specific vendor using the unwrapped ID
    const vendor = await prisma.vendorProfile.findUnique({
        where: { id: id },
    });

    if (!vendor) {
        return notFound();
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">{vendor.fullName}</h1>
                    <p className="text-muted-foreground">{vendor.email}</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge
                        variant={vendor.status === "APPROVED" ? "default" : vendor.status === "SUSPENDED" ? "destructive" : "outline"}
                        className="text-lg px-4 py-1"
                    >
                        {vendor.status}
                    </Badge>
                    <Button variant="outline" asChild>
                        <Link href="/admin/onboarded-vendors">Back to List</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Business Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Business Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Company Name:</span>
                            <span>{vendor.companyName || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">GST Number:</span>
                            <span>{vendor.gstNumber || "N/A"}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Business Type:</span>
                            <span>{vendor.businessType}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Joined:</span>
                            <span>{vendor.createdAt.toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Phone:</span>
                            <span>{vendor.phone}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Address:</span>
                            <span className="text-right max-w-[200px]">{vendor.address}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">City / State:</span>
                            <span>{vendor.city}, {vendor.state}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Postal Code:</span>
                            <span>{vendor.postalCode}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Bank Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Bank Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Bank Name:</span>
                            <span>{vendor.bankName}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Account Holder:</span>
                            <span>{vendor.accountHolder}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">Account No:</span>
                            <span>{vendor.accountNumber}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="font-semibold">IFSC Code:</span>
                            <span>{vendor.ifscCode}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle>Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold mb-1">ID Proof ({vendor.idProofType})</p>
                            {vendor.idProofUrl ? (
                                <a href={vendor.idProofUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                    View Document &rarr;
                                </a>
                            ) : (
                                <span className="text-muted-foreground text-sm">Not Uploaded</span>
                            )}
                        </div>
                        <div>
                            <p className="font-semibold mb-1">Location Photo</p>
                            {vendor.locationPhotoUrl ? (
                                <a href={vendor.locationPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                    View Photo &rarr;
                                </a>
                            ) : (
                                <span className="text-muted-foreground text-sm">Not Uploaded</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}