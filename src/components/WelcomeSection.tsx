import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface CharacterProps {
  char: string;
  index: number;
  centerIndex: number;
  scrollYProgress: MotionValue<number>;
}

const CharacterV1: React.FC<CharacterProps> = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}) => {
  const distanceFromCenter = index - centerIndex;

  // Phase 1 (0 to 0.50): Skiper31 Character animation (horizontal movement, 3D rotation, opacity)
  // Phase 2 & 3 (0.50 to 1.0): Stable completed state (held at 0 translation, 0 rotation, full opacity)
  const x = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [distanceFromCenter * 45, 0, 0]
  );
  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [distanceFromCenter * 35, 0, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 1],
    [0.2, 0.7, 1, 1]
  );

  return (
    <motion.span
      className={cn(
        "inline-block font-serif tracking-tight select-none text-[#171614]"
      )}
      style={{
        x,
        rotateX,
        opacity,
      }}
    >
      {char}
    </motion.span>
  );
};

export const WelcomeSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const text = "WELCOME TO QUEEN'S BAKERY";
  const words = text.split(" ");
  const totalLength = text.length;
  const centerIndex = Math.floor(totalLength / 2);

  // Calculate global character indices so individual character physics remain strictly preserved
  let globalCharCounter = 0;
  const wordData = words.map((word) => {
    const chars = word.split("").map((char) => {
      const charIndex = globalCharCounter;
      globalCharCounter++;
      return { char, index: charIndex };
    });
    // Account for space between words
    globalCharCounter++;
    return { word, chars };
  });

  // Fade out scroll indicator during initial scroll
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const indicatorY = useTransform(scrollYProgress, [0, 0.15], [0, -20]);

  return (
    <section
      id="welcome-section"
      ref={targetRef}
      className="relative box-border w-full h-[300vh] bg-[#F7F4EE]"
    >
      {/* Sticky Viewport Container - Stays pinned and centered throughout animation and hold */}
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden px-4 sm:px-8 md:px-12">
        {/* Subtle Scroll Hint */}
        <motion.div
          style={{ opacity: indicatorOpacity, y: indicatorY }}
          className="pointer-events-none absolute top-28 sm:top-32 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-center"
        >
          <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#171614]/50">
            Scroll to discover
          </span>
          <div className="h-10 w-px bg-gradient-to-b from-[#171614]/40 to-transparent animate-pulse" />
        </motion.div>

        {/* Skiper31 Character V1 Animated Display */}
        <div
          id="welcome-title-container"
          className="w-full max-w-7xl mx-auto flex items-center justify-center text-center font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[5.5rem] font-bold uppercase tracking-tight text-[#171614]"
          style={{
            perspective: "800px",
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-6 lg:gap-x-8 gap-y-2 leading-none">
            {wordData.map(({ word, chars }, wIdx) => (
              <span
                key={wIdx}
                className="inline-block whitespace-nowrap select-none"
              >
                {chars.map(({ char, index }) => (
                  <CharacterV1
                    key={index}
                    char={char}
                    index={index}
                    centerIndex={centerIndex}
                    scrollYProgress={scrollYProgress}
                  />
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

