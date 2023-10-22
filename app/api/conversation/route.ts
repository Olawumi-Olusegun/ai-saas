
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
        const { messages: promptMessage } = body;

        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401});
        }

        if(!openai?.apiKey) {
            return NextResponse.json("OpenAI API key not configured", {status: 500});
        }

        if(!promptMessage) {
            return NextResponse.json("Messages are required", {status: 400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if(!freeTrial && !isPro) {
            return NextResponse.json("Free trial has expired", {status: 403});
        }
        
        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: promptMessage,
        });

        if(!isPro) {
            await increaseApiLimit();
        }


        return NextResponse.json(chatCompletion.choices[0].message);

    } catch (error) {
        // console.log(error);
        return NextResponse.json("Internal server error", {status: 500});
    }
}