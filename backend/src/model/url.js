import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: [true, "Original URL is required"],
            trim: true,
        },

        shortCode: {
            type: String,
            required: [true, "Short code is required"],
            unique: true,
            trim: true,
            index: true,
        },

        isCustom: {
            type: Boolean,
            default: false,
        },

        clicks: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        expiresAt: {
            type: Date,
            default: null,
        },
        withUsername: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;