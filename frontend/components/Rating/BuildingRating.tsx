import React from "react";

export default function BuildingRating({
  overallRating,
}: {
  overallRating: number;
}) {
  const content = "★★★★★";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        color: "#ccc",
      }}
    >
      <span aria-label="rating">{content}</span>

      <span
        style={{
          width: `${(overallRating / 5) * 100}%`,
          color: "#D4613C",
          overflow: "hidden",
          position: "absolute",
          top: 0,
          left: 0,
          whiteSpace: "nowrap",
        }}
        aria-hidden={true}
      >
        {content}
      </span>
    </div>
  );
}
