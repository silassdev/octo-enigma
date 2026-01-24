import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const { name, jobTitle, company, phoneNumber, bio } = data;

        await connectToDatabase();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            {
                name,
                jobTitle,
                company,
                phoneNumber,
                bio,
                onboardingCompleted: true,
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Onboarding completed successfully" });
    } catch (error: any) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
