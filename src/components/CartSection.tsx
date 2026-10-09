import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Skiper67 } from "./Skiper67Video";

export const CartSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const headingY = useTransform(scrollYProgress, [0, 0.4], [40, 0]);
  const headingOpacity = useTransform(scrollYProgress, [0, 0.35], [0.2, 1]);

  return (
    <section
      id="cart-section"
      ref={sectionRef}
      className="relative w-full bg-[#F7F4EE] py-14 sm:py-18 md:py-24 px-4 sm:px-8 lg:px-16 overflow-hidden border-t border-[#D8D0C3]/40 flex flex-col items-center justify-center"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Section Heading - EXACT Wording */}
        <motion.div
          style={{ y: headingY, opacity: headingOpacity }}
          className="max-w-3xl mb-8 sm:mb-10"
        >
          <h2
            id="cart-section-heading"
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-[#171614] leading-[1.15]"
          >
            Add your favourites to cart. We'll handle the rest.
          </h2>
        </motion.div>

        {/* Skiper67 Video Preview & Modal Player */}
        <div className="w-full flex justify-center">
          <Skiper67 videoSrc="https://res.cloudinary.com/dpoymblzq/video/upload/v1786825239/create_a_seamless_cart_interaction_animation_1_-ezremove_faw0vu.mp4" />
        </div>
      </div>
    </section>
  );
};
