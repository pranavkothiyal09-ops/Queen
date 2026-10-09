import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";
import { ROYAL_MENU_IMAGES, ProductItem } from "@/data/products";
import { ProductImage } from "./ProductImage";

interface DockThumbnailProps {
  item: ProductItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}

const DockThumbnail: React.FC<DockThumbnailProps> = ({
  item,
  index,
  total,
  scrollYProgress,
}) => {
  const centerIndex = Math.floor(total / 2);
  const distanceFromCenter = index - centerIndex;

  // Skiper31 inspired scroll transformation curves settling into the horizontal dock
  const x = useTransform(
    scrollYProgress,
    [0, 0.45],
    [distanceFromCenter * 28, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.45],
    [Math.sin((index / total) * Math.PI) * 40 - 20, 0]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.45],
    [distanceFromCenter * 5, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.45], [0.3, 0.85, 1]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
      }}
      className="flex-shrink-0 cursor-pointer"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-xl sm:rounded-2xl bg-[#F7F4EE] border border-[#D8D0C3]/70",
          "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20",
          "shadow-[0_4px_16px_rgba(23,22,20,0.06)]",
          "transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(107,30,43,0.14)] hover:border-[#6B1E2B]/50"
        )}
      >
        <ProductImage
          product={item}
          className="h-full w-full object-cover object-center select-none pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export const RoyalMenuSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.35], [40, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.25], [0.2, 1]);

  return (
    <section
      id="royal-menu-section"
      ref={sectionRef}
      className="relative w-full bg-[#EFE9DE]/40 py-12 sm:py-16 md:py-20 px-4 sm:px-8 lg:px-12 overflow-hidden border-t border-[#D8D0C3]/40 flex flex-col items-center justify-center"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Section Heading - EXACT Wording */}
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="text-center max-w-3xl mb-6 sm:mb-8 md:mb-10 px-4"
        >
          <h2
            id="royal-menu-heading"
            className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-[#171614] leading-[1.18]"
          >
            Choose your favourites from our Royal Menu
          </h2>
        </motion.div>

        {/* 9 Product Images Showcase - Single Horizontal Dock Row */}
        <div
          id="royal-menu-dock-container"
          className="w-full flex items-center justify-center overflow-x-auto no-scrollbar py-4 px-2"
        >
          <div
            id="royal-menu-dock"
            className="inline-flex items-center justify-center gap-2 sm:gap-2.5 md:gap-3.5 lg:gap-4 p-2.5 sm:p-3 md:p-4 rounded-2xl sm:rounded-3xl bg-[#F7F4EE]/90 backdrop-blur-md border border-[#D8D0C3]/70 shadow-[0_12px_36px_rgba(23,22,20,0.05)]"
          >
            {ROYAL_MENU_IMAGES.map((item, index) => (
              <DockThumbnail
                key={item.id}
                item={item}
                index={index}
                total={ROYAL_MENU_IMAGES.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
