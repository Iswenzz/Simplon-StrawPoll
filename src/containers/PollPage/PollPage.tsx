import React, {FunctionComponent, useEffect, useState} from "react";
import NavBar from "../UI/NavBar/NavBar";
import Footer from "../UI/Footer/Footer";
import PollCard, {PollStatut} from "../../components/Poll/PollCard";
import {withRouter, RouteComponentProps} from "react-router-dom";
import {CircularProgress, Grid} from "@material-ui/core";
import PollRepository, {Poll, PollGetAPI} from "../../repositories/PollRepository";
import {motion, Variants} from "framer-motion";
import "./PollPage.scss";

export interface PollPageQueryString
{
	id?: string
}

export interface PollPageState
{
	poll: Poll | null,
	isLoading: boolean
}

export interface PollPageProps extends RouteComponentProps<PollPageQueryString> { }

const anim: Variants = {
	enter: {
		x: "0",
	},
	exit: {
		x: "100%",
	}
};

/**
 * Page to register/vote or see the result of a poll.
 * @param props
 * @constructor
 * @TODO - loader & animations.
 */
export const PollPage: FunctionComponent<PollPageProps> = (props: PollPageProps): JSX.Element =>
{
	const [state, setState] = useState<PollPageState>({
		poll: null,
		isLoading: false
	});

	useEffect(() =>
	{
		if (props.match.params.id)
			updatePoll(props.match.params.id);
	}, []);

	/**
	 * Fetch poll by id & update loader state.
	 * @param id - The poll ID.
	 */
	const updatePoll = async (id: number | string): Promise<void> =>
	{
		// set loader
		setState((prevState: PollPageState) => ({
			...prevState,
			isLoading: true
		}));

		// update poll data & loader
		const response: PollGetAPI | null = await PollRepository.getInstance().get(id);
		if (response && response.success)
		{
			setState((prevState: PollPageState) => ({
				...prevState,
				poll: response.poll,
				isLoading: false
			}));
		}
	};

	/**
	 * Poll statut change callback.
	 * @param statut - The new statut.
	 * @param pollId - The poll ID.
	 */
	const onStatutChange = (statut: PollStatut, pollId: number): void =>
	{
		// update react router & poll data
		if (props.history.location.pathname !== `/poll/${pollId}`)
			props.history.push(`/poll/${pollId}`);
		updatePoll(pollId);
	};

	const pollResult: JSX.Element = (
		<PollCard onStatutChange={onStatutChange} poll={state.poll}
				  className={"pollpage-poll"} statut={PollStatut.RESULT} />
	);

	const pollVote: JSX.Element = (
		<PollCard onStatutChange={onStatutChange} poll={state.poll}
				  className={"pollpage-poll"} statut={PollStatut.VOTE} />
	);

	const pollRegister: JSX.Element = (
		<PollCard onStatutChange={onStatutChange} poll={state.poll}
				  className={"pollpage-poll"} statut={PollStatut.REGISTER} />
	);

	/**
	 * Get the right poll element.
	 */
	const poll: JSX.Element = props.match.url.includes("poll")
		? (state.poll && state.poll.isVoted ? pollResult : pollVote) : pollRegister;

	return (
		<>
			<NavBar />
			<Grid className={"pollpage"} container direction={"column"}
				  justify={"center"} alignItems={"center"}>
				<motion.div initial={"exit"} variants={anim}
							animate={state.isLoading ? "exit" : "enter"}>
					{state.isLoading ? <CircularProgress color="secondary" /> : poll}
				</motion.div>
			</Grid>
			<Footer />
		</>
	);
};

export default withRouter(PollPage);