import {Grid} from "@material-ui/core";
import React, {Component} from "react";
import Poll, {PollStatut} from "components/Poll/Poll";
import "./PollForm.scss";

export class PollForm extends Component
{
	public render(): JSX.Element
	{
		return (
			<Grid className={"pollcreation"} container direction={"column"}
				  justify={"center"} alignItems={"center"}>
				<Poll className={"pollcreation-poll"} statut={PollStatut.REGISTER} />
			</Grid>
		);
	}
}

export default PollForm;