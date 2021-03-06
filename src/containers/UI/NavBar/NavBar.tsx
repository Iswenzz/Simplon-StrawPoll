import {FunctionComponent, useState} from "react";
import React from "react";
import {AppBar, Toolbar, Button, Typography, Grid, Fab, Drawer} from "@material-ui/core";
import {useMediaQuery} from "react-responsive";
import {Link} from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import "./NavBar.scss";

export const NavBar: FunctionComponent = (): JSX.Element =>
{
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const isTabletOrMobileDevice = useMediaQuery({ query: "(max-device-width: 1224px)" });
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

	/**
	 * Toggle the mobile drawer.
	 * @param visible - Visible state.
	 */
	const toggleDrawer = (visible: boolean): void =>
	{
		setDrawerOpen(visible);
	};

	/**
	 * Navbar links.
	 */
	const navBarElements: JSX.Element = (
		<>
			<li>
				<Link className="navbar-button" to={"/"} onClick={() => toggleDrawer(false)}>
					<Button size='large' color="inherit">Create</Button>
				</Link>
			</li>
			<li>
				<Link className="navbar-button" to={"/search"} onClick={() => toggleDrawer(false)}>
					<Button size='large' color="inherit">Search</Button>
				</Link>
			</li>
		</>
	);

	/**
	 * Desktop navbar.
	 */
	const navBarButtonsDesktop: JSX.Element = (
		<Grid component="ul" container direction="row" justify="flex-end" alignItems="center">
			{navBarElements}
		</Grid>
	);

	/**
	 * Mobile navbar.
	 */
	const navBarButtonsMobile: JSX.Element = (
		<Grid component="ul" container direction="row" justify="flex-end" alignItems="center">
			<li>
				<Fab className="navbar-button" color="inherit" size='small'
					 onClick={() => toggleDrawer(!drawerOpen)}>
					<MenuIcon />
				</Fab>
			</li>
			<li>
				<Drawer variant="persistent" anchor="top" open={drawerOpen} onClose={() => toggleDrawer(false)}
					PaperProps={{ style: { backgroundColor: "rgba(40, 40, 40, 0.7)", color: "gainsboro", top: "48px" }}}>
					<section role="presentation" onClick={() => toggleDrawer(false)} onKeyDown={() => toggleDrawer(false)}>
						<Grid component="ul" container direction="column" justify="center" alignItems="center">
							{navBarElements}
						</Grid>
					</section>
				</Drawer>
			</li>
		</Grid>
	);

	return (
		<AppBar className={"navbar"} component="nav" position={"fixed"}>
			<Toolbar variant="dense">
				<Grid component="section" container>
					<Grid component="figure" item xs={8} sm={5}>
						<a href="/" className={"navbar-logo"}>
							<Grid container justify={"flex-start"} alignItems={"center"} direction={"row"}>
								<img height={40} src={require("assets/images/strawpoll-logo.png")} alt="StrawPoll Logo"/>
								<Typography variant={"h2"} component={"h2"}>
									Straw Poll
								</Typography>
							</Grid>
						</a>
					</Grid>
					<Grid component="section" item xs={4} sm={7}>
						{isTabletOrMobileDevice || isPortrait ? navBarButtonsMobile : navBarButtonsDesktop}
					</Grid>
				</Grid>
			</Toolbar>
		</AppBar>
	);
};

export default NavBar;