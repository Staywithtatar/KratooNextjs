import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import StockLog from "../../../../models/stockLog";
import Strain from "../../../../models/strain";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import mongoose from "mongoose";

// GET /api/stockLogs - Get all stock logs with filtering and pagination
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
        
        // Filter by type
        if (searchParams.get('type')) {
            query.type = searchParams.get('type');
        }
        
        // Filter by strain
        if (searchParams.get('strainId')) {
            query.strain = searchParams.get('strainId');
        }

        // Filter by reference type
        if (searchParams.get('referenceType')) {
            query.referenceType = searchParams.get('referenceType');
        }

        // Pagination
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const total = await StockLog.countDocuments(query);

        // Get stock logs with pagination and populate related data
        const stockLogs = await StockLog.find(query)
            .populate('strain', 'name type')
            .populate('performedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Calculate summary statistics
        const summary = await StockLog.aggregate([
            { $match: query },
            {
                $group: {
                    _id: "$type",
                    totalQuantity: { $sum: "$quantity" },
                    count: { $sum: 1 }
                }
            }
        ]);

        return NextResponse.json({
            stockLogs,
            summary: summary.reduce((acc, curr) => ({
                ...acc,
                [curr._id]: {
                    totalQuantity: curr.totalQuantity,
                    count: curr.count
                }
            }), {}),
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error("Error in GET /api/stockLogs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/stockLogs - Create a new stock log entry
export async function POST(request) {
    try {
        const { strain, type, quantity, previousStock, newStock, reason, reference, referenceType, performedBy, notes } = await request.json();
        await connectMongoDB();
        await StockLog.create({ strain, type, quantity, previousStock, newStock, reason, reference, referenceType, performedBy, notes });
        return NextResponse.json({ message: "Stock log created" }, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while creating the stock log." },
            { status: 500 }
        );
    }
}

// PUT /api/stockLogs - Update a stock log entry (admin only)
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
                { error: "Stock log ID is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        await connectMongoDB();

        // Check if stock log exists
        const existingLog = await StockLog.findById(id);
        if (!existingLog) {
            return NextResponse.json(
                { error: "Stock log not found" },
                { status: 404 }
            );
        }

        // Only allow updating notes
        if (Object.keys(body).length !== 1 || !body.notes) {
            return NextResponse.json(
                { error: "Only notes can be updated" },
                { status: 400 }
            );
        }

        const updatedLog = await StockLog.findByIdAndUpdate(
            id,
            { notes: body.notes },
            { new: true }
        );

        return NextResponse.json(updatedLog);
    } catch (error) {
        console.error("Error in PUT /api/stockLogs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/stockLogs - Delete a stock log entry (admin only)
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
                { error: "Stock log ID is required" },
                { status: 400 }
            );
        }

        await connectMongoDB();

        // Check if stock log exists
        const stockLog = await StockLog.findById(id);
        if (!stockLog) {
            return NextResponse.json(
                { error: "Stock log not found" },
                { status: 404 }
            );
        }

        // Only allow deletion of recent logs (within 24 hours)
        const logAge = Date.now() - new Date(stockLog.createdAt).getTime();
        if (logAge > 24 * 60 * 60 * 1000) {
            return NextResponse.json(
                { error: "Can only delete stock logs within 24 hours of creation" },
                { status: 400 }
            );
        }

        // Start a session for transaction
        const dbSession = await mongoose.startSession();
        dbSession.startTransaction();

        try {
            // Reverse the stock change
            const stockChange = ['Stock In', 'Return'].includes(stockLog.type) ? 
                -stockLog.quantity : 
                ['Stock Out', 'Damage', 'Expiry'].includes(stockLog.type) ? 
                    stockLog.quantity : 
                    stockLog.previousStock - stockLog.newStock;

            await Strain.findByIdAndUpdate(
                stockLog.strain,
                { $inc: { stockQuantity: stockChange } },
                { session: dbSession }
            );

            // Delete the stock log
            await StockLog.findByIdAndDelete(id, { session: dbSession });

            await dbSession.commitTransaction();
            return NextResponse.json({ message: "Stock log deleted successfully" });
        } catch (error) {
            await dbSession.abortTransaction();
            throw error;
        } finally {
            dbSession.endSession();
        }
    } catch (error) {
        console.error("Error in DELETE /api/stockLogs:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
} 