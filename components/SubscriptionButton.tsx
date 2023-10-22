import React, { useState } from 'react'
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import axios from 'axios';

interface SubscriptionButtonProps {
    isPro: boolean;
}

const SubscriptionButton = ({isPro = false}:SubscriptionButtonProps) => {

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {

        try {
            setIsLoading(true)
            const response = await axios.get("/api/stripe");
            window.location.href = response?.data?.url;
        } catch (error) {
            console.log("Billing error");
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <Button disabled={isLoading} variant={isPro ? "default" : "premium"} onClick={handleClick}>
        {isPro ? "Manage Subscription" : "Upgrade"}
        {isPro && <Zap className='w-4 h-4 ml-2 fill-white' /> }
    </Button>
  )
}

export default SubscriptionButton