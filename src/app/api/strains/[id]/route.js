import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/mongodb";
import Strain from "../../../../models/strain";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        await connectMongoDB();
        const strain = await Strain.findById(id);
        if (!strain) {
            return NextResponse.json({ message: "Strain not found" }, { status: 404 });
        }
        return NextResponse.json({ strain }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while fetching the strain." },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const { name, type, thcContent, cbdContent, description, effects, flavors, price, stockQuantity, image, isActive } = await request.json();
        await connectMongoDB();
        const updatedStrain = await Strain.findByIdAndUpdate(id, { name, type, thcContent, cbdContent, description, effects, flavors, price, stockQuantity, image, isActive }, { new: true });
        if (!updatedStrain) {
            return NextResponse.json({ message: "Strain not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Strain updated", strain: updatedStrain }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while updating the strain." },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        await connectMongoDB();
        const deletedStrain = await Strain.findByIdAndDelete(id);
        if (!deletedStrain) {
            return NextResponse.json({ message: "Strain not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Strain deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while deleting the strain." },
            { status: 500 }
        );
    }
} 