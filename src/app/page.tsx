"use client";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const bishalNameRef = useRef(null);
  const pinSectionRef = useRef(null); // The section that provides the scroll duration for pinning

  useEffect(() => {
    // Ensure the refs are connected to elements before animating
    if (bishalNameRef.current && pinSectionRef.current) {
      const bishalElement = bishalNameRef.current;
      const pinSectionElement = pinSectionRef.current;

      // Set initial state of "BISHAL" (invisible, small)
      // GSAP will take it from its normal flow position within pinSectionRef later
      gsap.set(bishalElement, {
        opacity: 0,
        scale: 0.3,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinSectionElement, // Trigger based on the pinSection
          start: "top top", // When the top of pinSection hits the top of the viewport
          // Pin for a scroll duration equal to 1.5 times the height of the pinSectionElement
          // This means if pinSectionElement is 100vh, pinning lasts for 150vh of scroll.
          end: () => "+=" + pinSectionElement.offsetHeight * 1.5,
          pin: bishalElement, // Pin the "BISHAL" h1 element
          pinSpacing: "auto", // Let GSAP manage the spacing created by pinning.
          // 'true' or 'auto' usually work well.
          scrub: 1, // Smooth scrubbing effect (syncs animation to scroll)
          // markers: {startColor: "green", endColor: "red", indent: 50}, // For debugging scroll trigger positions
          invalidateOnRefresh: true, // Recalculate on window resize
        },
      });

      // Add animations to the timeline for the pinned element
      tl.to(bishalElement, {
        // 1. Animate "BISHAL" to be visible, scaled, and centered
        opacity: 1,
        scale: 1,
        // When pinned, GSAP makes the element position:fixed.
        // We explicitly animate its top/left and transform to ensure it's viewport-centered.
        top: "50%",
        left: "50%",
        xPercent: -50, // Centers the element based on its own width
        yPercent: -50, // Centers the element based on its own height
        duration: 1, // This duration is relative to the total scrub length
        ease: "power2.inOut",
      })
        .to(bishalElement, {
          // 2. Hold this state for a period
          // This empty 'to' with a duration effectively holds the previous state
          // for this part of the scrubbed timeline.
          duration: 2, // Relative duration
        })
        .to(bishalElement, {
          // 3. Animate "BISHAL" out (e.g., fade and shrink)
          opacity: 0,
          scale: 0.3,
          // Optionally, move it off-screen:
          // y: "-100vh", // Moves it upwards out of view
          duration: 1, // Relative duration
          ease: "power2.inOut",
        });
    }

    // Cleanup GSAP animations and ScrollTriggers on component unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []); // Empty dependency array ensures this runs once after mount

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {/* Section 1: Beautiful Picture (Hero Section) */}
      <section className="h-screen relative flex items-center justify-center bg-gray-900">
        {/* Replace '/placeholder-hero.jpg' with the actual path to your image in the `public` folder */}
        <Image
          src="/pexels-jaime-reimer-1376930-2662116.jpg"
          alt="A beautiful introductory scene"
          layout="fill"
          objectFit="cover" // Or "contain" based on your image and preference
          priority // Good for LCP (Largest Contentful Paint)
          className="opacity-60" // Optional: adjust opacity if you have text overlay
        />
        <div className="relative z-10 text-center p-4">
          <h2 className="text-5xl md:text-7xl text-white font-extrabold mb-4 animate-fade-in-slow">
            Your Stunning Headline
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 animate-fade-in-slower">
            Scroll down to discover more.
          </p>
        </div>
        {/* Simple CSS animation for hero text (optional) */}
        <style jsx global>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-slow {
            animation: fadeIn 1.5s ease-out 0.5s forwards;
            opacity: 0;
          }
          .animate-fade-in-slower {
            animation: fadeIn 1.5s ease-out 1s forwards;
            opacity: 0;
          }
        `}</style>
      </section>

      {/* Section 2: Pinning Section for "BISHAL" */}
      {/* This section's height, combined with the 'end' property in ScrollTrigger,
          determines how long "BISHAL" stays pinned.
          Content *inside* this section will scroll underneath the pinned name. */}
      <section
        ref={pinSectionRef}
        className="relative bg-slate-100 dark:bg-slate-800"
        style={{ height: "150vh" }} // Adjust height as needed for pin duration
      >
        {/* "BISHAL" name - will be pinned and animated by GSAP */}
        {/* Initial opacity is 0, GSAP handles the rest. text-center is for the text within the h1 block. */}
        <h1
          ref={bishalNameRef}
          className="text-[12vw] sm:text-[15vw] md:text-[20vw] lg:text-[23vw] font-bold text-center text-gray-800 dark:text-white opacity-0"
          // GSAP will control its positioning and transformations when pinned.
          // will-change can be a hint for performance.
          style={{ willChange: "opacity, transform" }}
        >
          CODE test
        </h1>

        {/* Dummy content within the pin section to demonstrate scrolling underneath */}
        {/* This content should appear after "BISHAL" has had some time to be visible.
            Adjust paddingTop to position it appropriately. */}
        <div
          className="absolute top-0 left-0 w-full flex flex-col items-center justify-start text-center p-10"
          style={{ paddingTop: "120vh" }} // Start this content lower down in the 150vh section
        >
          <h3 className="text-3xl md:text-4xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
            Content Scrolls Underneath
          </h3>
          <p className="text-lg md:text-xl max-w-2xl text-gray-600 dark:text-gray-400">
            As you scroll, this content (and the background of this section)
            moves up, while "BISHAL" remains pinned and centered in your view
            for a while.
          </p>
        </div>
      </section>

      {/* Section 3: Content After Pinned Element */}
      <section className="h-auto min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black p-8 py-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-gray-900 dark:text-gray-100">
          The Journey Continues
        </h2>
        <p className="text-xl md:text-2xl text-center max-w-3xl mb-10 text-gray-700 dark:text-gray-300">
          After "BISHAL" unpins, the normal page flow resumes. You can add any
          further sections or content here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Feature One
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed information about the first amazing feature of this page
              or project.
            </p>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Feature Two
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              More details about another compelling aspect that users will find
              interesting.
            </p>
          </div>
        </div>
      </section>

      {/* Footer or more spacing */}
      <footer className="h-[30vh] bg-gray-200 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Footer Content</p>
      </footer>
    </div>
  );
}
