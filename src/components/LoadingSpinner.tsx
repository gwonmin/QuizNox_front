import React from "react";

/**
 * 로딩 스피너 컴포넌트
 * @returns {JSX.Element} 로딩 스피너 컴포넌트
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <span className="ml-2 text-gray-600">로딩 중...</span>
    </div>
  );
};
