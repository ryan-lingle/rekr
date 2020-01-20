import React from "react";
import { errorLogger } from "./utils";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch({ message }, { componentStack }) {
    console.log(message);
    console.log(componentStack);
    if (message) errorLogger({
      error: {
        message
      },
      stack: componentStack.split("\n"),
      client: true,
      location: window.location.href
    });
  }

  render() {
    if (this.state.hasError) {
      return(
        <div className="message-box" style={{maxWidth: "500px"}}>
          Something appears to have gone wrong!<br></br>Our team is looking into it right now.
        </div>
      );
    }

    return this.props.children;
  }
};

export default ErrorBoundary;
