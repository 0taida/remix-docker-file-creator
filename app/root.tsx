import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body style={{
        backgroundColor: '#111',
        color: '#fff',
        minHeight: '100vh',
        margin: 0,
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

// Add proper error type
type ErrorBoundaryProps = {
  error: {
    message?: string;
    stack?: string;
  };
};

export function ErrorBoundary({ error }: ErrorBoundaryProps) {
  const errorMessage = error?.message || "An unexpected error occurred";
  
  return (
    <html lang="en" className="dark">
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body style={{
        backgroundColor: '#111',
        color: '#fff',
        minHeight: '100vh',
        margin: 0,
        padding: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          padding: '40px',
          backgroundColor: '#1a1a1a',
          borderRadius: '12px',
          border: '1px solid #333',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
        }}>
          <h1 style={{ color: '#ef4444', marginTop: 0 }}>Error</h1>
          <p style={{ color: '#999' }}>{errorMessage}</p>
          {error?.stack && (
            <pre style={{ 
              textAlign: 'left', 
              backgroundColor: '#222',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
              color: '#666'
            }}>
              {error.stack}
            </pre>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
