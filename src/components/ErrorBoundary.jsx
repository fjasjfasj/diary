import { Component } from 'react';

import ErrorMessage from './ErrorMessage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorMessage actions={['sign-out', 'home']} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
