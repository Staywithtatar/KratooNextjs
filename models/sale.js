import mongoose, { Schema } from "mongoose";

const saleSchema = new Schema({
    strain: {
        type: Schema.Types.ObjectId,
        ref: 'Strain',
        required: [true, "Strain reference is required"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0.1, "Quantity must be at least 0.1"],
        max: [1000, "Quantity cannot exceed 1000"]
    },
    unitPrice: {
        type: Number,
        required: [true, "Unit price is required"],
        min: [0, "Price cannot be negative"]
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"]
    },
    paymentMethod: {
        type: String,
        required: [true, "Payment method is required"],
        enum: ["Cash", "Credit Card", "Debit Card", "Bank Transfer", "Other"]
    },
    customerInfo: {
        name: {
            type: String,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            trim: true
        }
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ["Completed", "Pending", "Cancelled", "Refunded"],
        default: "Completed"
    },
    soldBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Seller information is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound index for efficient querying
saleSchema.index({ createdAt: -1, status: 1 });
saleSchema.index({ strain: 1, createdAt: -1 });

// Pre-save middleware to calculate total amount
saleSchema.pre('save', function(next) {
    if (this.isModified('quantity') || this.isModified('unitPrice')) {
        this.totalAmount = this.quantity * this.unitPrice;
    }
    next();
});

const Sale = mongoose.models.Sale || mongoose.model("Sale", saleSchema);
export default Sale;
