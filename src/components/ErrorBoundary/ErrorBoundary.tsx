import React, { ErrorInfo, ReactNode } from "react";
import { ErrorBoundaryContext } from "../../contexts/ErrorBoundaryContext";

type State = {
  hasError: boolean;
};

type Props = {
  fallback: ({
    children,
    error,
  }: {
    children: ReactNode;
    error: string;
  }) => ReactNode;
  children: ReactNode;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Example 'componentStack':
    //   in ComponentThatThrows (created by App)
    //   in ErrorBoundary (created by App)
    //   in div (created by App)
    //   in App
    //logErrorToMyService(error, info.componentStack);
    // TODO set Sentry here
    console.error("Got error", error, info);
  }

  private catch(error: Error) {
    //logErrorToMyService(error);
    console.error(error);
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;

      return (
        <Fallback
          error={
            "Something went wrong, please try to load the component again."
          }>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="button">
            Retry
          </button>
        </Fallback>
      );
    }

    return (
      <ErrorBoundaryContext.Provider value={(error) => this.catch(error)}>
        {this.props.children}
      </ErrorBoundaryContext.Provider>
    );
  }
}
