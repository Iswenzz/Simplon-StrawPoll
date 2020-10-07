import {Grid} from "@material-ui/core";
import React, {Component} from "react";
import Poll, {PollStatut} from "components/Poll/Poll";
import "./PollCreation.scss";

export class PollCreation extends Component
{
	public render(): JSX.Element
	{
		return (
			<Grid className={"pollcreation"} container direction={"column"}
				  justify={"center"} alignItems={"center"}>
				<Poll className={"pollcreation-poll"} question={"Laravel > Symfony"} statut={PollStatut.REGISTER}
					  entries={[{value: "yes"}, {value: "no"}, {value: "idk php is trash"}]} />
			</Grid>
		);
	}
}

export default PollCreation;