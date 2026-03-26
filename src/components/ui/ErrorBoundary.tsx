import { Component, type ReactNode } from 'react';

interface BoundaryState {
  hasError: boolean;
}

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  message?: string;
  retryLabel?: string;
};

export default class ErrorBoundary extends Component<ErrorBoundaryProps, BoundaryState> {
  static defaultProps = {
    message: 'Terjadi kesalahan pada komponen ini.',
    retryLabel: 'Coba lagi',
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-medium text-red-600 dark:text-red-400">{this.props.message}</p>
          <button
            className="mt-3 text-xs text-red-500 underline dark:text-red-400"
            onClick={() => this.setState({ hasError: false })}
          >
            {this.props.retryLabel}
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
