// models/notification.js
import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
    type: {
        type: String,
        enum: ['comment', 'reply'],
        required: true
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    read: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export default Notification;