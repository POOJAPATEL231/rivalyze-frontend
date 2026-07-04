import { useEffect, useState } from "react";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";

const REVIEWS = [
    {
        quote: "We finally see every move our competitors make before they even announce it.",
        name: "Alex Rivera",
        role: "Head of Product, Nimbus",
    },
    {
        quote: "Argus cut our competitive research time from days to minutes.",
        name: "Priya Nair",
        role: "VP Marketing, Fenwick",
    },
    {
        quote: "The evidence trail behind every insight is what sold our whole team.",
        name: "Marcus Lee",
        role: "Strategy Lead, Orbital",
    },
    {
        quote: "It's like having an analyst watching every competitor, all the time.",
        name: "Sara Kim",
        role: "Founder, Driftwood",
    },
];

const AUTOPLAY_INTERVAL_MS = 5000;

export function TestimonialCarousel() {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        const id = setInterval(() => api.scrollNext(), AUTOPLAY_INTERVAL_MS);
        return () => clearInterval(id);
    }, [api]);

    return (
        <Carousel setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
                {REVIEWS.map((review) => (
                    <CarouselItem key={review.name}>
                        <p className="mt-6 font-heading text-4xl text-primary/60">&ldquo;</p>
                        <p className="-mt-4 text-sm text-muted-foreground">
                            &ldquo;{review.quote}&rdquo;
                        </p>
                        <div className="mt-4">
                            <p className="font-heading text-sm font-semibold text-foreground">
                                {review.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{review.role}</p>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
}
