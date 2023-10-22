
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { auth } from "@clerk/nextjs";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});



export async function POST(request: Request) {
    try {
        const { userId } = auth();
        const body = await request.json();
        const { prompt, amount = 1, resolution = "512x512" } = body;

        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401});
        }

        if(!openai?.apiKey) {
            return NextResponse.json("OpenAI API key not configured", {status: 500});
        }

        if(!prompt) {
            return NextResponse.json("Messages are required", {status: 400});
        }

        if(!amount) {
            return NextResponse.json("Amount is required", {status: 400});
        }

        if(!resolution) {
            return NextResponse.json("Resolution is required", {status: 400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if(!freeTrial && !isPro) {
            return NextResponse.json("Free trial has expired", {status: 403});
        }

        const imagesCompletion = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
        });

        if(!isPro) {
            await increaseApiLimit();
        }

        return NextResponse.json(imagesCompletion?.data);

    } catch (error) {
        // console.log(error);
        return NextResponse.json("Internal server error", {status: 500});
    }
}