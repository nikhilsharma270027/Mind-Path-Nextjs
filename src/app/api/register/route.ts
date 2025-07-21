import { connectMongoDB } from "@/lib/mongodb";
import User from "@/models/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { username, email, password } = await req.json();
        console.log("Registering user:", { username, email, password });
        await connectMongoDB();

        const UserExists = await User.findOne({ email });

        if (UserExists) {
            return NextResponse.json(
                { error: "User already exists." },
                { status: 409 }
            );
        }

        // Here you would typically hash the password and save the user to your database
        // For demonstration, let's assume the user is saved successfully
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });

        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 201 }
        );

    } catch (error) {
        console.log("Error from register route.ts", error);
        return NextResponse.json(
            {
                error: "An error occurred while registering the user."
            },
            { status: 500 }
        );
    }
}