import React from "react";

export default function Navbar({
  title,
  showSearch = false,
  showAction = false,
  actionLabel,
  onActionClick,
  leftSlot,
}) {
  return (
    <nav className="flex h-20 items-center justify-between px-4">
      <div className="flex items-center gap-4">
        {leftSlot}
        <h1 className="font-bold text-lg">{title}</h1>
      </div>
      {showSearch && (
        <input
          placeholder="Search quizzes..."
          className="hidden sm:block max-w-sm w-full rounded-md border px-3 py-2"
        />
      )}
      {showAction && (
        <button
          onClick={onActionClick}
          className="cursor-pointer rounded-md bg-black px-4 py-2 text-white"
        >
          {actionLabel}
        </button>
      )}
    </nav>
  );
}
