import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { sheets } from "../../../../lib/googleSheets";

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

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        const search = searchParams.get('search');

        // Get all strains from the sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: 'Strains!A2:F',
        });

        let strains = response.data.values || [];
        
        // Transform the data to match the expected format and filter out inactive strains
        strains = strains
            .map(row => ({
                name: row[0] || '',
                type: row[1] || '',
                thcPercent: parseFloat(row[2]) || 0,
                stock: parseInt(row[3]) || 0,
                price: parseFloat(row[4]) || 0,
                notes: row[5] || '',
            }))
            .filter(strain => strain.name && strain.name !== '' && strain.notes !== 'Inactive'); // Filter out empty or inactive rows

        // Apply filters if provided
        if (type) {
            strains = strains.filter(strain => strain.type === type);
        }
        if (search) {
            const searchLower = search.toLowerCase();
            strains = strains.filter(strain => 
                strain.name.toLowerCase().includes(searchLower)
            );
        }
        
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
        
        // Validate required fields
        if (!body.name || !body.type || body.thcPercent === undefined || body.stock === undefined || body.price === undefined) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // Get existing strains to check for duplicates
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: 'Strains!A2:A', // Only get the name column
        });

        const existingNames = (response.data.values || []).map(row => row[0]).filter(name => name && name !== '');
        
        // Check if strain name already exists
        if (existingNames.includes(body.name)) {
            return NextResponse.json(
                { message: "ชื่อสายพันธุ์นี้มีอยู่ในระบบแล้ว" },
                { status: 400 }
            );
        }

        // Prepare the row data in the correct order with safe type conversion
        const rowData = [
            body.name,                    // Name
            body.type,                    // Type
            String(body.thcPercent || ''), // THC%
            String(body.stock || ''),      // Stock
            String(body.price || ''),      // Price
            body.notes || '',             // Notes
        ];

        // Append the new row to the sheet
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SHEET_ID,
            range: 'Strains!A2:F',
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData],
            },
        });
        
        return NextResponse.json(body, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/strains:", error);
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
        
        // Validate required fields
        if (!body.name || !body.type || body.thcPercent === undefined || body.stock === undefined || body.price === undefined) {
            return NextResponse.json(
                { message: "กรุณากรอกข้อมูลให้ครบถ้วน" },
                { status: 400 }
            );
        }

        // Get existing strains to check for conflicts
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: 'Strains!A2:A', // Only get the name column
        });

        const existingNames = (response.data.values || []).map(row => row[0]).filter(name => name && name !== '');
        const rowIndex = parseInt(id) - 2; // Convert to 0-based array index
        
        // Check if new name conflicts with other strains (excluding current row)
        if (body.name && body.name !== existingNames[rowIndex]) {
            if (existingNames.includes(body.name)) {
                return NextResponse.json(
                    { message: "ชื่อสายพันธุ์นี้มีอยู่ในระบบแล้ว" },
                    { status: 400 }
                );
            }
        }

        // Check if the strain exists
        if (rowIndex < 0 || rowIndex >= existingNames.length || !existingNames[rowIndex]) {
            return NextResponse.json(
                { message: "ไม่พบสายพันธุ์นี้" },
                { status: 404 }
            );
        }

        // Prepare the row data in the correct order
        const rowData = [
            body.name,
            body.type,
            String(body.thcPercent),
            String(body.stock),
            String(body.price), // Fixed: was using pricePerGram instead of price
            body.notes || '',
        ];

        // Update the sheet
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEET_ID,
            range: `Strains!A${id}:F${id}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [rowData],
            },
        });
        
        return NextResponse.json(body);
    } catch (error) {
        console.error("Error in PUT /api/strains:", error);
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
        
        // Get existing strains to check if the strain exists
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SHEET_ID,
            range: 'Strains!A2:A', // Only get the name column
        });

        const existingNames = (response.data.values || []).map(row => row[0]).filter(name => name && name !== '');
        const rowIndex = parseInt(id) - 2; // Convert to 0-based array index
        
        // Check if strain exists
        if (rowIndex < 0 || rowIndex >= existingNames.length || !existingNames[rowIndex]) {
            return NextResponse.json(
                { message: "ไม่พบสายพันธุ์นี้" },
                { status: 404 }
            );
        }

        // Instead of deleting, mark as inactive (soft delete)
        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.SHEET_ID,
            range: `Strains!A${id}:F${id}`,
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: [['', '', '', '', '', 'Inactive']],
            },
        });
        
        return NextResponse.json({ message: "ลบสายพันธุ์สำเร็จ" });
    } catch (error) {
        console.error("Error in DELETE /api/strains:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}