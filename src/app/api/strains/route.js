import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import Strain from "@/models/strain";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/strains - Get all strains with optional filtering
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectMongoDB();

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        // Build query
        let query = {};
        if (type) {
            query.type = type;
        }
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const strains = await Strain.find(query).sort({ createdAt: -1 });
        
        return NextResponse.json(strains);
    } catch (error) {
        console.error("Error in GET /api/strains:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// POST /api/strains - Create a new strain
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        await connectMongoDB();

        // Check if strain name already exists
        const existingStrain = await Strain.findOne({ name: body.name });
        if (existingStrain) {
            return NextResponse.json(
                { message: "ชื่อสายพันธุ์นี้มีอยู่ในระบบแล้ว" },
                { status: 400 }
            );
        }

        const strain = await Strain.create(body);
        
        return NextResponse.json(strain, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/strains:", error);
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PUT /api/strains/:id - Update a strain
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = params;
        const body = await request.json();
        
        await connectMongoDB();

        // Check if strain exists
        const strain = await Strain.findById(id);
        if (!strain) {
            return NextResponse.json(
                { message: "ไม่พบสายพันธุ์นี้" },
                { status: 404 }
            );
        }

        // Check if new name conflicts with other strains
        if (body.name && body.name !== strain.name) {
            const existingStrain = await Strain.findOne({ name: body.name });
            if (existingStrain) {
                return NextResponse.json(
                    { message: "ชื่อสายพันธุ์นี้มีอยู่ในระบบแล้ว" },
                    { status: 400 }
                );
            }
        }

        const updatedStrain = await Strain.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );
        
        return NextResponse.json(updatedStrain);
    } catch (error) {
        console.error("Error in PUT /api/strains:", error);
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { message: error.message },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// DELETE /api/strains/:id - Delete a strain (soft delete)
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        // Check if user is authenticated and is admin
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = params;
        
        await connectMongoDB();

        // Check if strain exists
        const strain = await Strain.findById(id);
        if (!strain) {
            return NextResponse.json(
                { message: "ไม่พบสายพันธุ์นี้" },
                { status: 404 }
            );
        }

        // Instead of deleting, mark as inactive
        await Strain.findByIdAndUpdate(id, { isActive: false });
        
        return NextResponse.json({ message: "ลบสายพันธุ์สำเร็จ" });
    } catch (error) {
        console.error("Error in DELETE /api/strains:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
} 