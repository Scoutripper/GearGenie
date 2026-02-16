import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
    console.error("Failed to find the root element");
} else {
    try {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } catch (error) {
        console.error("React Render Error:", error);
        document.body.innerHTML = `<div style="padding: 20px; color: red;"><h1>Mount Error</h1><pre>${error.message}</pre></div>`;
    }
}
