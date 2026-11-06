import React from "react";



export const Logo = ({ size = "5" }) => {
  // 1. Convert any number input to a string
  const sizeStr = String(size).trim();

  // 2. Parse the responsive string into individual tokens
  const tokens = sizeStr.split(/\s+/);

  // 3. Initialize default and breakpoint styles
  let baseSize = "5rem"; // Fallback unit (e.g., rem)
  const styles = {};

  tokens.forEach((token) => {
    if (token.includes(":")) {
      // It's a responsive token (e.g., "md:10")
      const [breakpoint, val] = token.split(":");
      // Append your preferred unit, like 'rem' or 'vw'
      styles[`--logo-size-${breakpoint}`] = `${val}rem`;
    } else {
      // It's the base/default size (e.g., "5")
      baseSize = `${token}rem`;
    }
  });

  return (
    <>
      {/* 4. Inject Media Queries mapping the CSS variables */}
      <style>{`
        .responsive-logo {
          width: ${baseSize};
        }
        @media (min-width: 640px) {
          .responsive-logo { width: var(--logo-size-sm, ${baseSize}); }
        }
        @media (min-width: 768px) {
          .responsive-logo { width: var(--logo-size-md, var(--logo-size-sm, ${baseSize})); }
        }
        @media (min-width: 1024px) {
          .responsive-logo { width: var(--logo-size-lg, var(--logo-size-md, ${baseSize})); }
        }
      `}</style>

      <img
        src="/Logo.png"
        alt="logo"
        className="responsive-logo rounded-full border-gold border-2 object-center object-cover "
      />
    </>
  );
};
