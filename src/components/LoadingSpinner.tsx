import React from "react";

/**
 * 로딩 스피너 컴포넌트
 * @returns {JSX.Element} 로딩 스피너 컴포넌트
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div
      className="flex justify-center items-center min-h-[200px] p-4"
      role="status"
      aria-label="로딩 중"
    >
      <div
        className="animate-spin rounded-full h-12 w-12 sm:h-8 sm:w-8 border-4 border-blue-500 border-t-transparent"
        aria-hidden="true"
      />
      <span className="ml-3 text-gray-600 text-sm sm:text-base">
        로딩 중...
      </span>
    </div>
  );
};
