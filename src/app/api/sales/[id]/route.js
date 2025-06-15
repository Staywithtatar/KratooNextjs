import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../../lib/mongodb";
import Sale from "../../../../../models/sale";

export async function GET(request, { params }) {
    const { id } = params;
    try {
        await connectMongoDB();
        const sale = await Sale.findById(id).populate('strain').populate('soldBy');
        if (!sale) {
            return NextResponse.json({ message: "Sale not found" }, { status: 404 });
        }
        return NextResponse.json({ sale }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while fetching the sale." },
            { status: 500 }
        );
    }
}

export async function PUT(request, { params }) {
    const { id } = params;
    try {
        const { strain, quantity, unitPrice, totalAmount, paymentMethod, customerInfo, notes, status, soldBy } = await request.json();
        await connectMongoDB();
        const updatedSale = await Sale.findByIdAndUpdate(id, { strain, quantity, unitPrice, totalAmount, paymentMethod, customerInfo, notes, status, soldBy }, { new: true });
        if (!updatedSale) {
            return NextResponse.json({ message: "Sale not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Sale updated", sale: updatedSale }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while updating the sale." },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    const { id } = params;
    try {
        await connectMongoDB();
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) {
            return NextResponse.json({ message: "Sale not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Sale deleted" }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "An error occurred while deleting the sale." },
            { status: 500 }
        );
    }
} 