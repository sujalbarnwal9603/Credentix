import mongoose, {Schema} from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true,
    },
    password:{
        type:String,
        required:true,
    },
    tenant:{
        type: Schema.Types.ObjectId,
        ref:"Tenant",
        required: true,
    },
    Role:{
        type:Schema.Types.ObjectId,
        ref:"Role",
        required: true,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    status:{
        type: String,
        enum: ["active", "suspended"],
        default: "active",
    }
}, {timestamps: true});


export const User= mongoose.model("User", userSchema);