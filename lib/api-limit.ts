import { auth } from "@clerk/nextjs";
import prismadb from "./prismadb";
import { MAX_FREE_COUNTS } from "@/constant";

export const increaseApiLimit = async () => {

    const { userId } = auth();

    if(!userId) return;

    try {
        const userApiLimit = await prismadb.userApiLimit.findUnique({
            where: { userId }
        });

        if(userApiLimit) {
            await prismadb.userApiLimit.update({
                where: {userId},
                data: { count: userApiLimit.count + 1 }
            });
        }

        await prismadb.userApiLimit.create({
            data: { userId, count: 1 }
        });



    } catch (error) {
        
    }
}

export const checkApiLimit = async () => {
    const { userId } = auth();

    if(!userId) return;

    try {

        const userApiLimit = await prismadb.userApiLimit.findUnique({
            where: { userId }
        });

        if(!userApiLimit || userApiLimit.count < MAX_FREE_COUNTS) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        
    }
}

export const getApiLimitCount = async () => {
    const { userId } = auth();
    if(!userId) return 0;
    try {
        const userApiLimit = await prismadb.userApiLimit.findUnique({
            where: { userId }
        });

        if(!userApiLimit) {
            return 0;
        } else {
            return userApiLimit.count;
        }

    } catch (error) {
        
    }
}