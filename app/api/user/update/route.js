import mongodb from "@/lib/mongodb";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import User from "@/models/User";

export async function POST(request) {
    try {
        await mongodb();
        const session = await getServerSession(authOptions)

        if (!session) {
            return Response.json(
                {
                    success: false,
                    message: "Unauthorized"
                },
                {
                    status: 401
                }
            )
        }

        const { username, bio } = await request.json();

        await User.findOneAndUpdate(
            { email: session.user.email },
            { username, bio }
        )

    } catch (error) {
        console.error(error);

        // (Username already taken)
        if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
            return Response.json(
                { success: false, message: "That username is already taken." },
                { status: 400 }
            );
        }

        // Generic server 
        return Response.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        )
    }

    return Response.json({
        success: true,
        message: "Profile updated successfully"
    });

}

export async function GET(request) {

    try {

        await mongodb();

        const session = await getServerSession(authOptions);

        if (!session) {
            return Response.json(
                { success: false, message: "Unauthorized" },
                { status: 404 }
            )
        }

        const user = await User.findOne({ email: session.user.email })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "User not found"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json({
            success: true,
            values: {
                username: user.username || "",
                bio: user.bio || "",
                profileImage: user.profileImage || null,
                coverImage: user.coverImage || null
            }
        })

    }
    catch (err) {
        console.error(err);

        // FIX 2: Filled the empty catch block
        return Response.json(
            { success: false, message: "Server Error" },
            { status: 500 }
        );
    }

}