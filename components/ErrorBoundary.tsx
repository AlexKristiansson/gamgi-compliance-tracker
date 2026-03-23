"use client";
import React from "react";

interface State { error: Error | null }

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  State
> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: "monospace", background: "#fff1f0", color: "#c0392b" }}>
          <h2>Rendering error</h2>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 13 }}>{String(this.state.error)}</pre>
          <pre style={{ whiteSpace: "pre-wrap", fontSize: 11, color: "#888" }}>{this.state.error.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
