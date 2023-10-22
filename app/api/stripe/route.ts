import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";
import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const settingsUrl = absoluteUrl("/settings");


export async function GET(request: Request) {

    const { userId } = auth();
    const user = await currentUser();

    if(!userId) {
        return NextResponse.json("Unauthorize", {status: 401});
    }

    if(!user) {
        return NextResponse.json("Unauthorize", {status: 401});
    }

    
    
    try {
        const userSubscription = await prismadb.userSubscription.findUnique({
            where: { userId }
        });
    
        if(userSubscription && userSubscription?.stripeCustomerId) {
            const stripeSession  = await stripe.billingPortal.sessions.create({
                customer: userSubscription?.stripeCustomerId,
                return_url: settingsUrl,
            });
    
            return NextResponse.json(JSON.stringify({url: stripeSession?.url}));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsUrl,
            cancel_url: settingsUrl,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user?.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: {
                            name: "Genius Pro",
                            description: "Unlimited AI Generations"
                        },
                        unit_amount: 2000,
                        recurring: {
                            interval: "month",
                        }
                    },
                    quantity: 1,

                }
            ],
            metadata: {
                userId
            }
        });

        return NextResponse.json(JSON.stringify({url: stripeSession?.url}));
        
    } catch (error) {
        return NextResponse.json({error: "Internal error"}, {status: 500});
    }
}