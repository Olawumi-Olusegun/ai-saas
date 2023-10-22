"use client";

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const testimonials = [
    {
        name: "Mark Zukerburg",
        avatar: "M",
        title: "Software Engineer",
        description: "This is the best i have used"
    },
    {
        name: "Elon Musk",
        avatar: "E",
        title: "Software Engineer",
        description: "This is the best i have used"
    },
    {
        name: "Steve Job",
        avatar: "S",
        title: "Software Engineer",
        description: "This is the best i have used"
    },
    {
        name: "Albert Estein",
        avatar: "A",
        title: "Software Engineer",
        description: "This is the best i have used"
    },
]


const LandingContent = () => {
  return (
    <div className='px-10 pb-20'>
        <h2 className='text-center text-4xl text-white font-extrabold mb-10'>
            Testimonials
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {testimonials?.map((testimonial) => (
                <Card key={testimonial?.name} className='bg-[#192339] hover:bg-white/10 transition duration-150 border-none text-white'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-x-2'>
                            <div>
                                <p className='text-lg'>{testimonial?.name}</p>
                                <p className='text-zinc-400 text-sm'>{testimonial?.title}</p>
                            </div>
                        </CardTitle>
                        <CardContent className='pt-4 px-0 '>
                            {testimonial?.description}
                        </CardContent>
                    </CardHeader>
                </Card>
            ))}
        </div>
    </div>
  )
}

export default LandingContent