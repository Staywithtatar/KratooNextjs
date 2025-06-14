import mongoose from 'mongoose';

const strainSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'กรุณาระบุชื่อสายพันธุ์'],
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: [true, 'กรุณาระบุประเภทสายพันธุ์'],
        enum: {
            values: ['Sativa', 'Indica', 'Hybrid'],
            message: 'ประเภทสายพันธุ์ต้องเป็น Sativa, Indica หรือ Hybrid'
        }
    },
    thcContent: {
        type: Number,
        required: [true, 'กรุณาระบุค่า THC'],
        min: [0, 'ค่า THC ต้องไม่ต่ำกว่า 0'],
        max: [100, 'ค่า THC ต้องไม่เกิน 100']
    },
    cbdContent: {
        type: Number,
        required: [true, 'กรุณาระบุค่า CBD'],
        min: [0, 'ค่า CBD ต้องไม่ต่ำกว่า 0'],
        max: [100, 'ค่า CBD ต้องไม่เกิน 100']
    },
    description: {
        type: String,
        required: [true, 'กรุณาระบุคำอธิบาย'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'กรุณาระบุราคา'],
        min: [0, 'ราคาต้องไม่ต่ำกว่า 0']
    },
    stock: {
        type: Number,
        required: [true, 'กรุณาระบุจำนวนสินค้า'],
        min: [0, 'จำนวนสินค้าต้องไม่ต่ำกว่า 0'],
        default: 0
    },
    image: {
        type: String,
        required: [true, 'กรุณาอัพโหลดรูปภาพ']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ถ้าโมเดลมีอยู่แล้วให้ใช้โมเดลที่มีอยู่ ถ้าไม่มีให้สร้างใหม่
const Strain = mongoose.models.Strain || mongoose.model('Strain', strainSchema);

export default Strain; 