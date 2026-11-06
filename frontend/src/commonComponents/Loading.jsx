const Loading = ({ subheading = "preparing something awesome..." }) => {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-text/30 backdrop-blur-sm animate-fade-in">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <div className="relative h-20 w-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-[5px] border-gold/25" />

          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-primary border-r-gold animate-spin" />

          {/* Inner Circle */}
          <div className="absolute inset-4 flex items-center justify-center rounded-full bg-background] shadow-lg">
            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col items-center">
          <h3 className="eczar text-xl font-bold text-text">Loading</h3>

          <p className="mate mt-1 text-sm text-text-subtle">{subheading}</p>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary" />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-gold"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="h-2.5 w-2.5 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
