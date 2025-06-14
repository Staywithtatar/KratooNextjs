import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Sale from "@/models/sale";
import Strain from "@/models/strain";
import StockLog from "@/models/stockLog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/sales - Get all sales with filtering and pagination
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectMongoDB();
        const { searchParams } = new URL(request.url);
        
        // Build query based on parameters
        const query = {};
        
        // Filter by date range
        if (searchParams.get('startDate') && searchParams.get('endDate')) {
            query.createdAt = {
                $gte: new Date(searchParams.get('startDate')),
                $lte: new Date(searchParams.get('endDate'))
            };
        }
        
        // Filter by status
        if (searchParams.get('status')) {
            query.status = searchParams.get('status');
        }
        
        // Filter by strain
        if (searchParams.get('strainId')) {
            query.strain = searchParams.get('strainId');
        }

        // Pagination
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await Sale.countDocuments(query);

        // Get sales with pagination and populate strain details
        const sales = await Sale.find(query)
            .populate('strain', 'name type price')
            .populate('soldBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate total amount for the filtered results
        const totalAmount = await Sale.aggregate([
            { $match: query },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        return NextResponse.json({
            sales,
            summary: {
                totalAmount: totalAmount[0]?.total || 0,
                totalSales: total
            },
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error in GET /api/sales:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/sales - Create a new sale
export async function POST(request) {
    try {
        const { strain, quantity, unitPrice, totalAmount, paymentMethod, customerInfo, notes, status, soldBy } = await request.json();
        await connectMongoDB();
        await Sale.create({ strain, quantity, unitPrice, totalAmount, paymentMethod, customerInfo, notes, status, soldBy });
        return NextResponse.json({ message: "Sale created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while creating the sale." },
            { status: 500 }
        );
    }
}

// PUT /api/sales - Update a sale (e.g., change status)
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: "Sale ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await connectMongoDB();

        // Check if sale exists
        const existingSale = await Sale.findById(id);
        if (!existingSale) {
            return NextResponse.json(
                { error: "Sale not found" },
                { status: 404 }
            );
        }

        // Only allow status updates
        if (Object.keys(body).length !== 1 || !body.status) {
            return NextResponse.json(
                { error: "Only status updates are allowed" },
                { status: 400 }
            );
        }

        const updatedSale = await Sale.findByIdAndUpdate(
            id,
            { status: body.status },
            { new: true }
        );

        return NextResponse.json(updatedSale);
    } catch (error) {
        console.error("Error in PUT /api/sales:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/sales - Cancel a sale (admin only)
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        
        if (!id) {
            return NextResponse.json(
                { error: "Sale ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if sale exists
        const sale = await Sale.findById(id);
        if (!sale) {
            return NextResponse.json(
                { error: "Sale not found" },
                { status: 404 }
            );
        }

        // Only allow cancellation of completed sales
        if (sale.status !== "Completed") {
            return NextResponse.json(
                { error: "Only completed sales can be cancelled" },
                { status: 400 }
            );
        }

        // Start a session for transaction
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            // Update sale status
            await Sale.findByIdAndUpdate(
                id,
                { status: "Cancelled" },
                { session: dbSession }
            );

            // Return stock
            await Strain.findByIdAndUpdate(
                sale.strain,
                { $inc: { stockQuantity: sale.quantity } },
                { session: dbSession }
            );

            // Create stock log for return
            await StockLog.create([{
                strain: sale.strain,
                type: "Return",
                quantity: sale.quantity,
                previousStock: (await Strain.findById(sale.strain)).stockQuantity - sale.quantity,
                reason: "Sale Cancellation",
                reference: id,
                referenceType: "Sale",
                performedBy: session.user.id
            }], { session: dbSession });

            await dbSession.commitTransaction();
            return NextResponse.json({ message: "Sale cancelled successfully" });
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }
    } catch (error) {
        console.error("Error in DELETE /api/sales:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 