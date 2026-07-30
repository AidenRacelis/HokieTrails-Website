"use client";

import type { Difficulty } from "@/lib/types";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cls =
    difficulty === "easy"
      ? "badge badge-easy"
      : difficulty === "medium"
        ? "badge badge-medium"
        : "badge badge-hard";
  return <span className={cls}>{difficulty}</span>;
}

export function Rating({ value, reviews }: { value?: number; reviews?: number }) {
  if (!value) return null;
  return (
    <span title={reviews ? `${reviews} reviews` : undefined}>
      ⭐ {value.toFixed(1)}
      {reviews ? (
        <span style={{ color: "#8a93a3", fontSize: 12 }}> ({reviews.toLocaleString()})</span>
      ) : null}
    </span>
  );
}

export function SaveButton({
  saved,
  onToggle,
  disabled,
}: {
  saved: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      className="save-btn"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      disabled={disabled}
      aria-label={saved ? "Remove bookmark" : "Save"}
      title={disabled ? "Sign in to save" : saved ? "Saved" : "Save"}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}
