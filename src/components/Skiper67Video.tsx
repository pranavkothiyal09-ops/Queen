import React, { useState, ComponentProps } from "react";
import { AnimatePresence, motion, useSpring } from "motion/react";
import { Play, Plus } from "lucide-react";
import {
  MediaControlBar,
  MediaController,
  MediaMuteButton,
  MediaPlayButton,
  MediaTimeRange,
} from "media-chrome/react";
import { cn } from "@/lib/utils";

export type VideoPlayerProps = ComponentProps<typeof MediaController>;

export const VideoPlayer = ({ style, ...props }: VideoPlayerProps) => (
  <MediaController
    style={{
      ...style,
    }}
    {...props}
  />
);

export type VideoPlayerControlBarProps = ComponentProps<typeof MediaControlBar>;

export const VideoPlayerControlBar = (props: VideoPlayerControlBarProps) => (
  <MediaControlBar {...props} />
);

export type VideoPlayerTimeRangeProps = ComponentProps<typeof MediaTimeRange>;

export const VideoPlayerTimeRange = ({
  className,
  ...props
}: VideoPlayerTimeRangeProps) => (
  <MediaTimeRange
    className={cn(
      "[--media-range-thumb-opacity:0] [--media-range-track-height:2px]",
      className
    )}
    {...props}
  />
);

export type VideoPlayerPlayButtonProps = ComponentProps<typeof MediaPlayButton>;

export const VideoPlayerPlayButton = ({
  className,
  ...props
}: VideoPlayerPlayButtonProps) => (
  <MediaPlayButton className={cn("p-2 text-[#F7F4EE]", className)} {...props} />
);

export type VideoPlayerMuteButtonProps = ComponentProps<typeof MediaMuteButton>;

export const VideoPlayerMuteButton = ({
  className,
  ...props
}: VideoPlayerMuteButtonProps) => (
  <MediaMuteButton className={cn("p-2 text-[#F7F4EE]", className)} {...props} />
);

export type VideoPlayerContentProps = ComponentProps<"video">;

export const VideoPlayerContent = ({
  className,
  ...props
}: VideoPlayerContentProps) => (
  <video
    ref={(el) => {
      if (el) {
        el.muted = true;
        el.defaultMuted = true;
        el.play().catch(() => {});
      }
    }}
    className={cn("mb-0 mt-0", className)}
    {...props}
  />
);

interface Skiper67Props {
  videoSrc?: string;
}

export const Skiper67: React.FC<Skiper67Props> = ({
  videoSrc = "https://res.cloudinary.com/dpoymblzq/video/upload/v1786825239/create_a_seamless_cart_interaction_animation_1_-ezremove_faw0vu.mp4",
}) => {
  const [showVideoPopOver, setShowVideoPopOver] = useState(false);

  const SPRING = {
    mass: 0.1,
    stiffness: 150,
    damping: 15,
  };

  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);
  const opacity = useSpring(0, SPRING);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    opacity.set(1);
    const bounds = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - bounds.left - 30);
    y.set(e.clientY - bounds.top - 30);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full my-8">
      {/* Click indicator hint */}
      <div className="mb-6 text-center">
        <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#171614]/50">
          Click preview to expand
        </span>
      </div>

      <AnimatePresence>
        {showVideoPopOver && (
          <VideoPopOver
            videoSrc={videoSrc}
            setShowVideoPopOver={setShowVideoPopOver}
          />
        )}
      </AnimatePresence>

      {/* Small interactive square video preview with cursor-following play indicator */}
      <div
        id="cart-video-preview-trigger"
        onMouseMove={handlePointerMove}
        onMouseLeave={() => {
          opacity.set(0);
        }}
        onClick={() => setShowVideoPopOver(true)}
        className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl overflow-hidden cursor-pointer shadow-[0_12px_36px_rgba(23,22,20,0.08)] border border-[#D8D0C3]/80 bg-[#EFE9DE] transition-transform duration-300 hover:scale-[1.03] group"
      >
        <motion.div
          style={{ x, y, opacity }}
          className="pointer-events-none absolute z-30 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-[#171614]/80 backdrop-blur-md text-xs font-medium text-[#F7F4EE] shadow-lg"
        >
          <Play className="w-3 h-3 fill-[#F7F4EE]" />
          <span>Play</span>
        </motion.div>

        <video
          ref={(el) => {
            if (el) {
              el.muted = true;
              el.defaultMuted = true;
              el.play().catch(() => {});
            }
          }}
          autoPlay
          muted
          playsInline
          loop
          className="h-full w-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

const VideoPopOver = ({
  videoSrc,
  setShowVideoPopOver,
}: {
  videoSrc: string;
  setShowVideoPopOver: (showVideoPopOver: boolean) => void;
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="absolute inset-0 bg-[#171614]/85 backdrop-blur-md"
        onClick={() => setShowVideoPopOver(false)}
      />

      {/* Animated Modal Player */}
      <motion.div
        initial={{ clipPath: "inset(40% 40% 40% 40% round 16px)", opacity: 0, scale: 0.85 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 16px)", opacity: 1, scale: 1 }}
        exit={{
          clipPath: "inset(40% 40% 40% 40% round 16px)",
          opacity: 0,
          scale: 0.85,
          transition: {
            duration: 0.35,
          },
        }}
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 120,
          damping: 20,
        }}
        className="relative z-10 w-full max-w-xl aspect-square rounded-2xl overflow-hidden shadow-2xl bg-[#171614] border border-[#D8D0C3]/20"
      >
        <VideoPlayer style={{ width: "100%", height: "100%", backgroundColor: "#171614" }}>
          <VideoPlayerContent
            src={videoSrc}
            autoPlay
            loop
            playsInline
            slot="media"
            className="w-full h-full object-cover"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Close button */}
          <button
            id="close-video-modal-btn"
            onClick={() => setShowVideoPopOver(false)}
            className="absolute right-3 top-3 z-20 cursor-pointer rounded-full p-2 bg-[#171614]/60 text-white/90 hover:bg-[#6B1E2B] transition-colors focus:outline-none"
            aria-label="Close video"
          >
            <Plus className="w-5 h-5 rotate-45" />
          </button>

          {/* Media Chrome controls */}
          <VideoPlayerControlBar className="absolute bottom-0 left-1/2 flex w-full -translate-x-1/2 items-center justify-between px-4 py-3 bg-gradient-to-t from-[#171614]/80 to-transparent">
            <VideoPlayerPlayButton className="h-5 bg-transparent text-white" />
            <VideoPlayerTimeRange className="bg-transparent text-white flex-1 mx-3" />
            <VideoPlayerMuteButton className="w-5 h-5 bg-transparent text-white" />
          </VideoPlayerControlBar>
        </VideoPlayer>
      </motion.div>
    </div>
  );
};
