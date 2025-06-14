import mongoose, { Schema } from "mongoose";

const stockLogSchema = new Schema({
    strain: {
        type: Schema.Types.ObjectId,
        ref: 'Strain',
        required: [true, "Strain reference is required"]
    },
    type: {
        type: String,
        required: [true, "Log type is required"],
        enum: ["Stock In", "Stock Out", "Adjustment", "Return", "Damage", "Expiry"]
    },
    quantity: {
        type: Number,
        required: [true, "Quantity is required"],
        min: [0.1, "Quantity must be at least 0.1"]
    },
    previousStock: {
        type: Number,
        required: [true, "Previous stock level is required"],
        min: [0, "Previous stock cannot be negative"]
    },
    newStock: {
        type: Number,
        required: [true, "New stock level is required"],
        min: [0, "New stock cannot be negative"]
    },
    reason: {
        type: String,
        required: [true, "Reason for stock change is required"],
        trim: true
    },
    reference: {
        type: String,
        trim: true
    },
    // For stock in, this would be the supplier
    // For stock out, this would be the sale reference
    referenceType: {
        type: String,
        enum: ["Sale", "Supplier", "Adjustment", "Return", "Other"],
        required: [true, "Reference type is required"]
    },
    performedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User who performed the action is required"]
    },
    notes: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add compound indexes for efficient querying
stockLogSchema.index({ strain: 1, createdAt: -1 });
stockLogSchema.index({ type: 1, createdAt: -1 });
stockLogSchema.index({ performedBy: 1, createdAt: -1 });

// Pre-save middleware to calculate new stock level
stockLogSchema.pre('save', function(next) {
    if (this.isModified('quantity')) {
        switch(this.type) {
            case 'Stock In':
            case 'Return':
                this.newStock = this.previousStock + this.quantity;
                break;
            case 'Stock Out':
            case 'Damage':
            case 'Expiry':
                this.newStock = this.previousStock - this.quantity;
                break;
            case 'Adjustment':
                // For adjustment, quantity represents the new total
                this.newStock = this.quantity;
                break;
        }
    }
    next();
});

const StockLog = mongoose.models.StockLog || mongoose.model("StockLog", stockLogSchema);
export default StockLog;
