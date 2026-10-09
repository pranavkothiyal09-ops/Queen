import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";
import { MapPin, Compass } from "lucide-react";

interface StoryImageItem {
  id: number;
  title: string;
  url: string;
  localSrc?: string;
  isLogo?: boolean;
  alt: string;
}

const STORY_IMAGES: StoryImageItem[] = [
  {
    id: 1,
    title: "The Royal Seal",
    url: "https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2Zfc3VwZXJtYXJrZXRfbmF0dXJhbF9saWdodF9iYWtlcnlfcHJvZl82YWRhODY0NC02OTM1LTQyZWYtODZiOC01MTE0Mjc5ZTgzYWZfMS5qcGc.jpg",
    localSrc: "https://images.rawpixel.com/image_social_landscape/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIzLTA5L3Jhd3BpeGVsb2ZmaWNlMTJfcGhvdG9fb2Zfc3VwZXJtYXJrZXRfbmF0dXJhbF9saWdodF9iYWtlcnlfcHJvZl82YWRhODY0NC02OTM1LTQyZWYtODZiOC01MTE0Mjc5ZTgzYWZfMS5qcGc.jpg",
    isLogo: true,
    alt: "Queen's Bakery heritage interior and freshly baked goods",
  },
  {
    id: 2,
    title: "Artisanal Kitchen",
    url: "https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDI0LTAyL3Jhd3BpeGVsX29mZmljZV81OF9waG90b19vZl9iYWtlcnlfc2hvcF9uYXR1cmFsaXN0aWNfYWVzdGhldGljXzhkYzgzMWY5LWEyOTYtNDFmMC05Mjc4LTc5NmZiZmFjNTc2Yl8xLmpwZw.jpg",
    localSrc: "/assets/story-2.jpg",
    alt: "Bakery shop naturalistic aesthetic",
  },
  {
    id: 3,
    title: "Golden Morning Bakes",
    url: "https://png.pngtree.com/thumb_back/fw800/background/20241130/pngtree-warm-golden-bakery-aesthetic-with-assorted-pastries-image_16711409.jpg",
    localSrc: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop",
    alt: "Warm golden bakery aesthetic with assorted pastries",
  },
  {
    id: 4,
    title: "Heirloom Confections",
    url: "https://aestheticwallpapers.io/wallpaper/953693.png",
    localSrc: "/assets/story-4.png",
    alt: "Artisan bakery delights",
  },
  {
    id: 5,
    title: "Delicate Viennoiserie",
    url: "https://aestheticwallpapers.io/wallpaper/649582.jpg",
    localSrc: "/assets/story-5.jpg",
    alt: "Finely layered pastries and croissants",
  },
  {
    id: 6,
    title: "Coffee & Dark Cacao",
    url: "https://static.vecteezy.com/system/resources/previews/053/689/421/non_2x/delicious-coffee-and-pastries-on-a-dark-background-free-photo.jpg",
    localSrc: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1200&auto=format&fit=crop",
    alt: "Delicious coffee and pastries on dark backdrop",
  },
  {
    id: 7,
    title: "Handcrafted Treats",
    url: "https://i.pinimg.com/736x/82/49/ac/8249ac95fe78c1f75a65755e3e65a36e.jpg",
    localSrc: "/assets/story-7.jpg",
    alt: "Warm handcrafted bakery collection",
  },
];

interface StickyCardProps {
  item: StoryImageItem;
  index: number;
  total: number;
}

/**
 * Skiper34 StickyCard_003 implementation adapted for Queen's Bakery Our Story section.
 * Preserves the exact motion mechanics:
 * - sticky positioning
 * - useScroll + useInView + useMotionValue + useTransform
 * - scaling down and rotating based on scroll progress
 * - counter-rotating inner image so visual contents remain upright
 */
const StoryStickyCard: React.FC<StickyCardProps> = ({ item, index, total }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [maxScrollY, setMaxScrollY] = useState<number>(Infinity);
  const [imgSrc, setImgSrc] = useState<string>(item.localSrc || item.url);

  const filter = useMotionValue(0);
  const negateFilter = useTransform(filter, (value) => -value);

  const { scrollY } = useScroll({
    target: containerRef,
  });

  const scale = useTransform(
    scrollY,
    [maxScrollY, maxScrollY + 2500],
    [1, 0.88]
  );

  const isInView = useInView(containerRef, {
    margin: "0px 0px -20% 0px",
    once: true,
  });

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latestScrollY) => {
      let animationValue = 1;
      if (latestScrollY > maxScrollY) {
        animationValue = Math.max(0.85, 1 - (latestScrollY - maxScrollY) / 2500);
      }
      scale.set(animationValue);
      // Subtle rotation angle based on card index (slight alternating tilt)
      const tiltDirection = index % 2 === 0 ? 1 : -1;
      filter.set((1 - animationValue) * 8 * tiltDirection);
    });

    return () => unsubscribe();
  }, [maxScrollY, scrollY, scale, filter, index]);

  useEffect(() => {
    if (isInView) {
      setMaxScrollY(scrollY.get());
    }
  }, [isInView, scrollY]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "sticky w-full rounded-3xl sm:rounded-4xl overflow-hidden border border-[#D8D0C3]/90 shadow-[0_15px_35px_rgba(23,22,20,0.08)] transition-shadow duration-300",
        item.isLogo ? "bg-[#171614]" : "bg-[#EFE9DE]"
      )}
      style={{
        scale,
        rotate: filter,
        top: `${80 + index * 10}px`,
        height: "360px",
      }}
    >
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        <div className="relative w-full h-full">
          <motion.img
            src={imgSrc}
            alt={item.alt}
            referrerPolicy="no-referrer"
            onError={() => {
              if (item.localSrc && imgSrc !== item.localSrc) {
                setImgSrc(item.localSrc);
              } else if (imgSrc !== item.url) {
                setImgSrc(item.url);
              }
            }}
            style={{
              rotate: negateFilter,
            }}
            className="h-full w-full scale-105 object-cover object-center select-none"
            loading="lazy"
          />
          {/* Subtle Gradient Overlay & Card Badge */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#171614]/70 via-transparent to-black/10 pointer-events-none" />
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-[#F7F4EE] pointer-events-none">
            <span className="font-serif font-medium text-sm tracking-wide drop-shadow-sm">
              {item.isLogo ? "House of Queen's Bakery" : item.title}
            </span>
            <span className="font-mono text-[10px] opacity-75 bg-[#171614]/40 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/10">
              0{index + 1} / 0{total}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OurStorySection: React.FC = () => {
  return (
    <section
      id="our-story"
      className="relative w-full bg-[#F7F4EE] text-[#171614] py-24 sm:py-32 px-6 sm:px-10 lg:px-16 border-t border-[#E8E2D5]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Brand Story, Editorial Copy & Heritage Details */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-8">
            {/* Main Editorial Heading */}
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171614] leading-[1.15]">
                Our Story
              </h2>
              <div className="h-1 w-12 bg-[#6B1E2B] rounded-full mt-4" />
            </div>

            {/* Two Curated Paragraphs */}
            <div className="space-y-5 text-base sm:text-lg text-[#171614]/80 leading-relaxed font-sans">
              <p>
                Queen's Bakery brings a curated selection of freshly crafted bakery
                favourites to your doorstep. From indulgent cakes and delicate
                pastries to comforting coffee and handcrafted confections, the
                platform makes it simple to discover something worth savouring.
              </p>
              <p>
                Created as an online bakery experience for Delhi NCR, Queen's
                Bakery combines thoughtful presentation, quality, and convenient
                delivery to make every order feel a little more special.
              </p>
            </div>

            {/* Editorial Highlights */}
            <div className="pt-4 border-t border-[#D8D0C3]/80 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#EFE9DE] text-[#6B1E2B] border border-[#D8D0C3]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[#171614]">
                    Delhi NCR Delivery
                  </span>
                  <span className="text-[#171614]/60">Fresh to your door</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#EFE9DE] text-[#6B1E2B] border border-[#D8D0C3]">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold block text-[#171614]">
                    Handcrafted Daily
                  </span>
                  <span className="text-[#171614]/60">Curated recipes</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Skiper34 StickyCard_003 7-Image Scroll Reveal */}
          <div className="lg:col-span-7 flex flex-col gap-[35vh] pb-[20vh] pt-4">
            {STORY_IMAGES.map((item, idx) => (
              <StoryStickyCard
                key={item.id}
                item={item}
                index={idx}
                total={STORY_IMAGES.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
