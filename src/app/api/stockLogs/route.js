import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import StockLog from "@/models/stockLog";
import Strain from "@/models/strain";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// GET /api/stockLogs - Get all stock logs with filtering and pagination
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        await connectMongoDB();
        const stockLogs = await StockLog.find().sort({ createdAt: -1 });

        return new Response(JSON.stringify(stockLogs), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error fetching stock logs:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}

// POST /api/stockLogs - Create a new stock log entry
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "admin") {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const body = await request.json();
        const { strainId, quantity, type, notes } = body;

        if (!strainId || !quantity || !type) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        await connectMongoDB();
        const stockLog = await StockLog.create({
            strainId,
            quantity,
            type,
            notes,
            createdBy: session.user.id
        });

        return new Response(JSON.stringify(stockLog), {
            status: 201,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error creating stock log:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
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