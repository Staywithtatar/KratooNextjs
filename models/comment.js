// models/comment.js
import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Comment = mongoose.models.Comment || mongoose.model("Comment", commentSchema);
export default Comment;