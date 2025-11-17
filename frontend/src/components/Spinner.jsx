import React from 'react';

// /**
//  * A dynamic spinner component whose size can be controlled by props.
//  * @param {object} props
//  * @param {string} [props.height="h-8"] Tailwind height class (e.g., "h-12", "h-full")
//  * @param {string} [props.width="w-8"] Tailwind width class (e.g., "w-12", "w-full")
//  * @param {string} [props.color="text-cyan-500"] Tailwind color class (e.g., "text-red-500")
//  */

/**
 * A dynamic circle spinner component.
 * @param {object} props
 * @param {string} [props.size="h-8 w-8"] Tailwind size classes
 * @param {string} [props.color="text-cyan-500"] Tailwind color class
 */
export const Spinner = ({ size = "h-8 w-8", color = "text-cyan-500" }) => {
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${size} animate-spin rounded-full border-4 border-gray-200 border-t-current ${color}`}
      />
    </div>

    // <div className={`flex items-center justify-center gap-1 ${size}`}>
    //   <div className={`${color} w-1 animate-pulse`} style={{ animationDuration: "1s" }} />
    //   <div className={`${color} w-1 animate-pulse`} style={{ animationDuration: "0.8s" }} />
    //   <div className={`${color} w-1 animate-pulse`} style={{ animationDuration: "0.5s" }} />
    //   <div className={`${color} w-1 animate-pulse`} style={{ animationDuration: "0.7s" }} />
    // </div>
  );
};





export function ButtonSpinner({ size = 16, color = "text-white" }) {
  return (
    <svg
      className={`animate-spin ${color}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      width={size}
      height={size}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  );
}
