"use client";

export default function DescriptionSection() {
  return (
    <div className="text-start flex flex-col mb-8">
      <div className="inline-flex items-center space-x-3 mb-4">
        <h1 className="text-3xl font-bold text-black dark:text-white">
          AI Docs Generator
        </h1>
      </div>
      <p className="text-black-800 dark:text-white">
        I built an AI Docs Generator that helps developers create documentation
        faster.
      </p>
    </div>
  );
}
