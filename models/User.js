import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: String,
    username: { type: String, unique: true, sparse: true },
    bio: String,
    coverImage: String,
    profileImage: String,

},

    {
        timestamps: true
    }

)


export default mongoose.models.User || mongoose.model("User", userSchema); 