"use client"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import messages from "@/messages.json"
import Autoplay from "embla-carousel-autoplay"

const Home = () => {
  return (
    <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
      <section className='text-center mb-8 md:mb-12'>
        <h1 className='text-3xl md:text-5xl font-bold'>Welcome to Anonymous World!!!</h1>
        <p className='mt-3 md:mt-4 text-base md:text-xl'>Explore Anno-Posts - Where your identity remains Anonymous</p>
      </section>

      <Carousel plugins={[Autoplay({delay: 2000})]} className="w-full max-w-xs">
        <CarouselContent>
          {/* {Array.from({ length: 5 }).map((_, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardContent className="flex aspect-square items-center justify-center p-6">
                    <span className="text-4xl font-semibold">{index + 1}</span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))} */}
          {
            messages.map((message, index)=>(
              <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    {message.title}
                  </CardHeader>
                  <CardContent className="flex items-center justify-center aspect-square py-8">
                    <span className="text-lg font-semibold">{message.content}</span>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <span>{message.received}</span>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
            ))
          }
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </main>
  )
}

export default Home