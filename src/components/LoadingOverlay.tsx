interface LoadingOverlayProps {
  show: boolean;
  message?: string;
}

export function LoadingOverlay({ show, message = '로딩 중...' }: LoadingOverlayProps) {
  if (!show) return null;
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center space-y-4">
        {/* 스피너 */}
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        {/* 로딩 텍스트 */}
        <p className="text-white text-sm sm:text-base font-semibold drop-shadow-lg">
          {message}
        </p>
      </div>
    </div>
  );
}


