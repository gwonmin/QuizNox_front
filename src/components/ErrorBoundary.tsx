import React from "react";
import { Button } from "./ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 바운더리 컴포넌트
 * @param {Props} props - 컴포넌트 props
 * @returns {JSX.Element} 에러 바운더리 컴포넌트
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center text-destructive">
          <h2 className="text-xl font-bold mb-2">오류가 발생했습니다</h2>
          <p className="mb-4">{this.state.error?.message}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="default"
          >
            페이지 새로고침
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
