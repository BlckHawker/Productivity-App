/**
 * Root component for the frontend React application.
 * Displays a simple welcome message as a placeholder.
 */

import React from "react";

/**
 * Renders the main application UI.
 *
 * @returns A React element containing a greeting message.
 */
export function App(): React.ReactElement {
	return (
		<div style={{ padding: "1rem", fontFamily: "sans-serif" }}>
			<h1>Hello World</h1>
			<p>This is a placeholder React app.</p>
		</div>
	);
}

export default App;
