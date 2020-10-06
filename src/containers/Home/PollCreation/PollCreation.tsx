import {Grid} from "@material-ui/core";
import React, {Component} from "react";
import Poll from "components/Poll/Poll";
import "./PollCreation.scss";

export class PollCreation extends Component
{
	public render(): JSX.Element
	{
		return (
			<Grid className={"pollcreation"} container direction={"column"}
				  justify={"center"} alignItems={"center"}>
				<Poll className={"pollcreation-poll"} name={"Laravel > Symfony"}
					  entries={[{name: "yes"}, {name: "no"}, {name: "idk php is trash"}]} />
			</Grid>
		);
	}
}

export default PollCreation;