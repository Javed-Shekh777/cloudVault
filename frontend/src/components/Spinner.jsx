import React from 'react';

// /**
//  * A dynamic spinner component whose size can be controlled by props.
//  * @param {object} props
//  * @param {string} [props.height="h-8"] Tailwind height class (e.g., "h-12", "h-full")
//  * @param {string} [props.width="w-8"] Tailwind width class (e.g., "w-12", "w-full")
//  * @param {string} [props.color="text-cyan-500"] Tailwind color class (e.g., "text-red-500")
//  */
const Spinner = ({ height = "h-8", width = "w-8", color = "text-cyan-500" }) => {
  // Combine dynamic classes into a single string
  const spinnerClasses = `${height} ${width} ${color} animate-spin`;

  return (
    <div className="flex items-center justify-center">
      {/* Using a simple div with a border for the spinner effect */}
      <div
        className={spinnerClasses}
        style={{
          // Using arbitrary values if h- or w- classes aren't enough (e.g. style={{height: '50px', width: '50px'}} )
        }}
      >
        {/* Visual implementation of the spinner using borders */}
        <div className="h-full w-full border-4 border-t-current border-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default Spinner;
