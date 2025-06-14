import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
    customer: {
        name: {
            type: String,
            required: [true, 'กรุณากรอกชื่อลูกค้า'],
            trim: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    items: [{
        strain: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Strain',
            required: [true, 'กรุณาระบุสายพันธุ์']
        },
        quantity: {
            type: Number,
            required: [true, 'กรุณาระบุจำนวน'],
            min: [0.1, 'จำนวนต้องไม่ต่ำกว่า 0.1']
        },
        price: {
            type: Number,
            required: [true, 'กรุณาระบุราคา'],
            min: [0, 'ราคาต้องไม่ต่ำกว่า 0']
        }
    }],
    totalAmount: {
        type: Number,
        required: [true, 'กรุณาระบุยอดรวม'],
        min: [0, 'ยอดรวมต้องไม่ต่ำกว่า 0']
    },
    paymentMethod: {
        type: String,
        required: [true, 'กรุณาระบุวิธีการชำระเงิน'],
        enum: {
            values: ['เงินสด', 'โอนเงิน', 'บัตรเครดิต'],
            message: 'วิธีการชำระเงินต้องเป็น เงินสด, โอนเงิน หรือ บัตรเครดิต'
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ['รอดำเนินการ', 'เสร็จสมบูรณ์', 'ยกเลิก'],
            message: 'สถานะต้องเป็น รอดำเนินการ, เสร็จสมบูรณ์ หรือ ยกเลิก'
        },
        default: 'รอดำเนินการ'
    },
    note: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'กรุณาระบุผู้สร้างรายการ']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add indexes for efficient querying
saleSchema.index({ createdAt: -1 });
saleSchema.index({ 'customer.name': 'text', 'customer.phone': 'text' });
saleSchema.index({ status: 1, createdAt: -1 });

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale; 