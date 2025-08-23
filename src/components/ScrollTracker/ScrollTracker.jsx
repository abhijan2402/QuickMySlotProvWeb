import React, { useState, useEffect } from "react";
import "./ScrollTracker.css";

const ScrollTracker = () => {
  const [scrollingDown, setScrollingDown] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const currentScrollTop = window.pageYOffset;

      // Check if the user is scrolling down or up
      if (currentScrollTop > lastScrollTop) {
        setScrollingDown(true);
      } else {
        setScrollingDown(false);
      }

      setScrollPosition(currentScrollTop);
      lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="scroll-tracker">
      <div
        className={`scroll-tracker-btn ${
          scrollingDown ? "scrolling-down" : ""
        } ${scrollPosition === 0 ? "hidden" : ""}`}
        style={{
          borderTopWidth: `${
            (scrollPosition /
              (document.documentElement.scrollHeight - window.innerHeight)) *
            100
          }%`,
        }}
        onClick={handleScrollToTop}
      >
        <span className="arrow">&#8593;</span>
      </div>
    </div>
  );
};

export default ScrollTracker;
