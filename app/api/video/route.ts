
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import Replicate from "replicate";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN || "",
});




export async function POST(request: Request) {
    try {

        const { userId } = auth();
        const body = await request.json();
        const { prompt  } = body;

        if(!userId) {
            return NextResponse.json("Unauthorized", {status: 401});
        }

        if(!replicate?.auth) {
            return NextResponse.json("API key not configured", {status: 500});
        }

        if(!prompt) {
            return NextResponse.json("Propmt is required", {status: 400});
        }

        const freeTrial = await checkApiLimit();
        const isPro = await checkSubscription()

        if(!freeTrial && !isPro) {
            return NextResponse.json("Free trial has expired", {status: 403});
        }

        const response = await replicate.run(
          "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
          {
            input: {
              prompt: "An astronaut riding a horse"
            }
          }
        );

        if(!isPro) {
          await increaseApiLimit();
        }
        
        return NextResponse.json(response, {status: 200});

    } catch (error) {
        // console.log(error);
        return NextResponse.json("Internal server error", {status: 500});
    }
}