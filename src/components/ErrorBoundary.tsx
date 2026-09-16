import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("Unexpected rendering error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6 text-center">
          <div className="max-w-md rounded-xl border border-[#4b5563] bg-[#1e293b] p-8 shadow-xl">
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="mt-3 text-gray-400">
              We couldn't display this page correctly. Please try again.
            </p>
            <button
              onClick={this.handleRetry}
              className="mt-6 rounded-lg bg-[#818cf8] px-4 py-2 font-medium text-white transition-colors hover:bg-[#6366f1]"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
