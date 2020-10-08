import React, {FunctionComponent, useEffect, useState} from "react";
import NavBar from "../UI/NavBar/NavBar";
import Footer from "../UI/Footer/Footer";
import Poll, {getPollById, PollResponseAPI, PollStatut} from "../../components/Poll/Poll";
import {withRouter, RouteComponentProps} from "react-router-dom";
import {Grid} from "@material-ui/core";
import "./PollPage.scss";

export interface PollPageQueryString
{
	id?: string
}

export interface PollPageState
{
	poll: PollResponseAPI | null,
	isLoading: boolean
}

export interface PollPageProps extends RouteComponentProps<PollPageQueryString> { }

export const PollPage: FunctionComponent<PollPageProps> = (props: PollPageProps): JSX.Element =>
{
	const [state, setState] = useState<PollPageState>({
		poll: null,
		isLoading: false
	});

	useEffect(() =>
	{
		// set loader
		setState((prevState: PollPageState) => ({
			...prevState,
			isLoading: true
		}));

		// fetch poll request
		if (props.match.params.id)
		{
			// update poll data & loader
			getPollById(props.match.params.id).then((poll: PollResponseAPI | null) =>
			{
				setState((prevState: PollPageState) => ({
					...prevState,
					poll: poll,
					isLoading: false
				}));
			});
		}
	}, []);

	const pollVote: JSX.Element = (
		<Poll className={"pollpage-poll"} question={state.poll?.question}
			  entries={state.poll?.entries} statut={PollStatut.VOTE} />
	);

	const pollRegister: JSX.Element = (
		<Poll className={"pollpage-poll"} statut={PollStatut.REGISTER} />
	);

	return (
		<>
			<NavBar />
			<Grid className={"pollpage"} container direction={"column"}
				  justify={"center"} alignItems={"center"}>
				{props.match.url.includes("poll") ? pollVote : pollRegister}
			</Grid>
			<Footer />
		</>
	);
};

export default withRouter(PollPage);