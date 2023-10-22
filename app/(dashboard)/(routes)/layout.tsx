import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { getApiLimitCount } from '@/lib/api-limit'
import { checkSubscription } from '@/lib/subscription'
import React, {PropsWithChildren} from 'react'

const DashboardLayout = async ({children}: PropsWithChildren) => {

  const apiLimitCount = await getApiLimitCount() || 0;
  const isPro = await checkSubscription() || false;

  return (
    <div className='h-full relative'>
        <div className='hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900'>
            <div className='text-white h-full'>
              <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
            </div>
        </div>
        
        <main className="md:pl-72">
            <Navbar />
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout