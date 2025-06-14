import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "กรุณากรอกชื่อ"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "กรุณากรอกอีเมล"],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "กรุณากรอกรหัสผ่าน"],
        minlength: [6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"]
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create model if it doesn't exist, or use existing model
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User; 