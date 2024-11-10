"use client";

export const Hero = () => {
  // Changed to lowercase
  const headingParts = ["first", "check", "to", "future founders"];

  return (
    <div className="max-w-xl py-5">
      <h1 className="text-3xl font-bold mb-4 flex flex-wrap cursor-default">
        {headingParts.map((part, index) => (
          <span key={index} className="whitespace-nowrap">
            {index === 3 && <span className="w-full block sm:hidden"></span>}
            {index === 3 ? (
              <>
                <span className="transition-colors duration-200 hover:text-[var(--color-primary)]">
                  future
                </span>
                <span>&nbsp;founders</span>
              </>
            ) : (
              <>
                {part}
                {index < headingParts.length - 1 && <span>&nbsp;</span>}
              </>
            )}
          </span>
        ))}
      </h1>
      <p className="text-sm">
        basecase writes the first check to builders who are still dreaming,
        tinkering, and exploring what they want to create.
      </p>
    </div>
  );
};
