import mongoose, { Schema } from "mongoose";

const strainSchema = new Schema({
    name: {
        type: String,
        required: [true, "Strain name is required"],
        trim: true,
        unique: true
    },
    type: {
        type: String,
        required: [true, "Strain type is required"],
        enum: ["Indica", "Sativa", "Hybrid"]
    },
    thcContent: {
        type: Number,
        required: [true, "THC content is required"],
        min: [0, "THC content cannot be negative"],
        max: [100, "THC content cannot exceed 100%"]
    },
    cbdContent: {
        type: Number,
        required: [true, "CBD content is required"],
        min: [0, "CBD content cannot be negative"],
        max: [100, "CBD content cannot exceed 100%"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    effects: [{
        type: String,
        trim: true
    }],
    flavors: [{
        type: String,
        trim: true
    }],
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    stockQuantity: {
        type: Number,
        required: [true, "Stock quantity is required"],
        min: [0, "Stock quantity cannot be negative"],
        default: 0
    },
    image: {
        type: String,
        default: "/images/default-strain.jpg"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Add text index for search functionality
strainSchema.index({ name: 'text', description: 'text', effects: 'text', flavors: 'text' });

const Strain = mongoose.models.Strain || mongoose.model("Strain", strainSchema);
export default Strain;