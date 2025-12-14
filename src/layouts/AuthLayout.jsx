import loginBg from "../assets/cake-bg2.png";

export const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="relative min-h-screen w-full bg-white overflow-hidden">
      
      {/* ✅ 1. SVG DEFINITION (Invisible Helper) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <clipPath id="waveCurve" clipPathUnits="objectBoundingBox">
            {/* This path draws a box that covers the right side.
               It starts at (0.3, 0) -> creates a curve down to (0.5, 1) -> goes to (1,1) -> (1,0) -> closes.
               Adjust the first '0.3' (30%) if you want the image to start further left or right.
            */}
            <path d="M 1,0 L 0.45,0 C 0.35,0.3, 0.65,0.6, 0.4,1 L 1,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ✅ 2. CAKE IMAGE — Clipped by the SVG above */}
      <div 
        className="
          hidden md:block 
          absolute top-0 right-0 
          h-full w-full 
          z-0
        "
      >
        <img
          src={loginBg}
          alt="Auth Visual"
          className="h-full w-full object-cover"
          // This applies the shape defined in the <svg> above
          style={{ clipPath: "url(#waveCurve)" }}
        />
      </div>

      {/* ✅ 3. FORM CONTENT */}
      {/* Z-Index 10 ensures text sits above any background elements.
          We use w-full md:w-1/2 to keep the form on the left side.
      */}
      <div className="relative z-10 flex min-h-screen w-full md:w-[50%] flex-col justify-center px-8 lg:px-24">
        
        {/* Brand Logo Area */}
        <div className="absolute top-10 left-8 lg:left-24">
           {/* Replace this text with your Logo Image if you have one like in the screenshot */}
           <h1 className="text-2xl font-serif italic text-gray-800">
             SweetNest
           </h1>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[420px]">
          <h2 className="text-4xl font-serif text-gray-900 mb-8 text-center md:text-left">
            {title}
          </h2>

          {subtitle && (
            <p className="text-gray-500 mb-6">{subtitle}</p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};