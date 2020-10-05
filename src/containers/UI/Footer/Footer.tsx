import React, {FunctionComponent, memo} from "react";
import {Container, Fab, Grid, Typography} from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faYoutube, faGithub, faReddit, faFacebook, faTwitch, faVk } from "@fortawesome/free-brands-svg-icons";
import {useMediaQuery} from "react-responsive";
import "./Footer.scss";

export const Footer: FunctionComponent = (): JSX.Element =>
{
	const isPortrait = useMediaQuery({ orientation: "portrait" });
	const isTabletOrMobileDevice = useMediaQuery({ query: "(max-device-width: 1224px)" });

	return (
		<footer className={"footer"}>
			<Grid className={"footer-socials"} container direction={"row"} alignItems={"center"}>
				<Fab color="primary" style={{ margin: 5 }}>
					<FontAwesomeIcon color='#7289da' icon={faDiscord} size='2x' />
				</Fab>
				<Fab color="primary" style={{ margin: 5 }}>
					<FontAwesomeIcon color='#7289da' icon={faYoutube} size='2x' />
				</Fab>
				<Fab color="primary" style={{ margin: 5 }}>
					<FontAwesomeIcon color='#7289da' icon={faGithub} size='2x' />
				</Fab>
				<Fab color="primary" style={{ margin: 5 }}>
					<FontAwesomeIcon color='#7289da' icon={faReddit} size='2x' />
				</Fab>
			</Grid>
			<hr/>
			<Container maxWidth={"md"}>
				<Grid className={"footer-grid"} container justify={"space-evenly"} alignItems={"center"}>
					<Grid item xs={isTabletOrMobileDevice || isPortrait ? 12 : 6}>
						<img src={""} alt="StrawPoll Logo"/>
					</Grid>
					<Grid className={"footer-copyrights"} item xs={isTabletOrMobileDevice || isPortrait ? 12 : 6}>
						<Typography paragraph component={"p"}>
							yes le description
						</Typography>
						<Typography className={"footer-iswenzz"} variant={"h6"} component={"h6"}>
							Iswenzz © 2020
						</Typography>
					</Grid>
				</Grid>
			</Container>
		</footer>
	);
};

export default memo(Footer);