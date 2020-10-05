import React, {FunctionComponent} from "react";
import Home from "containers/Home/Home";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, responsiveFontSizes, ThemeProvider } from "@material-ui/core";
import "./App.scss";

/**
 * The main app container.
 * @constructor
 */
export const App: FunctionComponent<any> = (props: any): JSX.Element =>
{
	const theme = responsiveFontSizes(createMuiTheme({
		overrides: {
			MuiCssBaseline: {
				"@global": {
					html: {
						"--scrollbarBG": props.isDarkMode ? "#23272a" : "#d9d9d9",
						"--thumbBG": props.isDarkMode ? "#3a3d41" : "#c0c0c0",
						overflowX: "hidden",
						overflowY: "visible"
					},
					body: {
						scrollbarWidth: "thin",
						scrollbarColor: "var(--thumbBG) var(--scrollbarBG)",
						backgroundColor: props.isDarkMode ? "black" : "silver",
						margin: 0,
					},
					ul: {
						listStyle: "none",
						margin: 0,
						padding: 0
					},
					"::-webkit-scrollbar": {
						width: "12px"
					},
					"::-webkit-scrollbar-track": {
						background: "var(--scrollbarBG)",
						borderRadius: "10px"
					},
					"::-webkit-scrollbar-thumb": {
						backgroundColor: "var(--thumbBG)",
						border: "3px solid var(--scrollbarBG)",
						borderRadius: "10px",
					},
				}
			},
			MuiTooltip: {
				tooltip: {
					fontSize: "1em",
				}
			},
			MuiFab: {
				primary: {
					backgroundColor: props.isDarkMode ? "#2c2f33" : "#e5e5e5"
				},
			},
			MuiDialogTitle: {
				root: {
					backgroundColor: props.isDarkMode ? "#23272a" : "#e5e5e5"
				}
			},
			MuiDialogContent: {
				root: {
					fontFamily: "Ubuntu",
					fontSize: 18,
					color: `rgba(${props.isDarkMode ? 220 : 60}, ${props.isDarkMode ? 220 : 60}, ${props.isDarkMode ? 220 : 60}, 0.87)`
				}
			}
		},
	}));

	return (
		<React.StrictMode>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Home />
			</ThemeProvider>
		</React.StrictMode>
	);
};

export default App;