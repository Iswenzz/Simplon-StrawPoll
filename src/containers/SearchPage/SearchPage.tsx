import React, {FunctionComponent, useEffect, useState} from "react";
import NavBar from "../UI/NavBar/NavBar";
import {CircularProgress, Grid} from "@material-ui/core";
import {motion, Variants} from "framer-motion";
import Footer from "../UI/Footer/Footer";
import PollRepository, {Poll} from "../../repositories/PollRepository";
import PollCard, {PollStatut} from "../../components/Poll/PollCard";
import {getRandomIntRange} from "../../util/utilities";
import {RouteComponentProps, withRouter} from "react-router-dom";
import "./SearchPage.scss";

export interface SearchPageState
{
	polls: Poll[],
	isLoading: boolean
}

export interface SearchPageProps extends RouteComponentProps { }

/**
 * Page to search a Poll.
 * @constructor
 */
export const SearchPage: FunctionComponent<SearchPageProps> = (props: SearchPageProps): JSX.Element =>
{
	const [state, setState] = useState<SearchPageState>({
		polls: [],
		isLoading: false
	});

	useEffect(() =>
	{
		fetchPolls();
	}, []);

	const fetchPolls = async (query = "null"): Promise<void> =>
	{
		setState((prevState: SearchPageState) => ({
			...prevState,
			isLoading: true
		}));

		const polls: Poll[] | null = await PollRepository.getInstance().search(query);
		if (polls)
		{
			console.log(polls);
			setState((prevState: SearchPageState) => ({
				...prevState,
				polls: polls,
				isLoading: false
			}));
		}
	};

	/**
	 * Redirect to the right poll on click.
	 * @param id - The poll id.
	 */
	const selectPoll = (id: number): void =>
	{
		props.history.push(`/poll/${id}`);
	};

	const polls: JSX.Element = (
		<>
			{state.polls.map((poll: Poll) => {
				const anim: Variants = {
					enter: {
						scale: 1,
						transition: {
							type: "spring",
							delay: getRandomIntRange(1, 7) / 10,
							duration: 0.8
						}
					},
					exit: {
						scale: 0,
						transition: {
							type: "spring",
							delay: getRandomIntRange(1, 7) / 10,
							duration: 0.8
						}
					}
				};

				return (
					<motion.div className={"searchpage-poll-wrapper"} key={poll.id}
								initial={"exit"} variants={anim}
								animate={state.isLoading ? "exit" : "enter"}
								onClick={() => selectPoll(poll.id)}>
						<PollCard poll={poll} className={"searchpage-poll"}
								  statut={PollStatut.RESULT}/>
					</motion.div>
				);
			})}
		</>
	);

	return (
		<>
			<NavBar />
			<Grid className={"searchpage"} container direction={"row"}
				  justify={"center"} alignItems={"center"}>
				{state.isLoading ? <CircularProgress color="secondary" /> : polls}
			</Grid>
			<Footer />
		</>
	);
};

export default withRouter(SearchPage);