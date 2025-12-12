"use client";
import { Button } from "@mui/material";
import { useState, useEffect, useRef } from "react";

interface ClampedTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  lines: number;
  lineHeight?: number;
  showMoreText?: string;
  showLessText?: string;
}

const ClampedText: React.FC<ClampedTextProps> = ({
  children,
  lines,
  lineHeight = 24,
  showMoreText = "Show more",
  showLessText = "Show less",
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [clampedHeight, setClampedHeight] = useState(lineHeight * lines);
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Function to measure content and determine if clamping is needed
    const measureContent = () => {
      if (!contentRef.current) return;

      // Get the computed line height from the content element
      const styles = window.getComputedStyle(contentRef.current);

      // Calculate the line height more reliably
      let lineHeight;

      // Method 1: Try to get the computed line-height directly
      if (styles.lineHeight !== "normal" && styles.lineHeight !== "auto") {
        // If it's a specific value (e.g., "24px"), parse it
        lineHeight = parseFloat(styles.lineHeight);
      } else {
        // Method 2: For 'normal' or 'auto', approximate using font size
        // Typical browsers use ~1.2 times font size for 'normal' line height
        const fontSize = parseFloat(styles.fontSize);
        lineHeight = fontSize * 1.2;

        // Method 3: Create a more accurate measurement using a test element
        const tempEl = document.createElement("div");
        tempEl.style.position = "absolute";
        tempEl.style.visibility = "hidden";
        tempEl.style.width = `${contentRef.current.clientWidth}px`;
        tempEl.style.fontFamily = styles.fontFamily;
        tempEl.style.fontSize = styles.fontSize;
        tempEl.style.fontWeight = styles.fontWeight;
        tempEl.style.lineHeight = styles.lineHeight;

        // Create two lines of text to measure the difference
        tempEl.innerHTML = "X<br>X";
        document.body.appendChild(tempEl);

        // Get the height of two lines and divide by 2
        const twoLineHeight = tempEl.clientHeight;
        document.body.removeChild(tempEl);

        // If we got a valid measurement, use it instead
        if (twoLineHeight > 0) {
          lineHeight = twoLineHeight / 2;
        }
      }

      // Ensure we have a positive value for line height
      lineHeight = Math.max(lineHeight, parseFloat(styles.fontSize));

      // Calculate clamped height based on exact line height
      const calculatedClampedHeight = lineHeight * lines;
      setClampedHeight(calculatedClampedHeight);

      // Get the full content height
      const fullHeight = contentRef.current.scrollHeight;
      setContentHeight(fullHeight);

      // Check if content needs clamping
      setIsClamped(fullHeight > calculatedClampedHeight);
    };

    // Wait for next frame to ensure the DOM is fully rendered
    requestAnimationFrame(() => {
      measureContent();
    });

    // Re-measure on window resize
    window.addEventListener("resize", measureContent);
    return () => window.removeEventListener("resize", measureContent);
  }, [children, lines]);

  return (
    <div {...props}>
      <div
        ref={containerRef}
        style={{
          overflow: "hidden",
          maxHeight: isExpanded ? `${contentHeight}px` : `${clampedHeight}px`,
          transition: "max-height 0.3s ease-in-out",
        }}
      >
        <div ref={contentRef}>{children}</div>
      </div>

      {isClamped && (
        <div className="mt-2 flex items-center justify-center">
          <Button
            variant="text"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? showLessText : showMoreText}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClampedText;
