"use client";
import { useState } from "react";
import { PortableText } from "next-sanity";
import { BlockContent } from "@/sanity.types";

const ProductDescription = ({ description }: { description: BlockContent }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div
        className={`prose max-w-none text-gray-700 transition-all duration-300 ${
          expanded ? "max-h-full" : "max-h-32 overflow-hidden"
        }`}
      >
        <PortableText value={description} />
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-2 text-blue-600 hover:underline font-medium"
      >
        {expanded ? "View Less" : "View More"}
      </button>
    </div>
  );
};

export default ProductDescription;
