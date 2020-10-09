import React, {Component, createRef, memo} from "react";
import {
	Button,
	TextField,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	Typography, TextareaAutosize, LinearProgress
} from "@material-ui/core";
import * as uuid from "uuid";
import {motion, Variants} from "framer-motion";
import PollRepository, {Poll, PollCreateAPI, PollEntry} from "../../repositories/PollRepository";
import "./PollCard.scss";
import {PieChart} from "react-minimal-pie-chart";

export interface PollProps
{
	className?: string,
	style?: React.CSSProperties,
	statut: PollStatut,
	onStatutChange?: (statut: PollStatut, pollId: number) => void,
	poll?: Poll | null
}

export interface PollState
{
	radioValue?: string,
	statut: PollStatut,
	errorMessage?: string,
	registerList: React.RefObject<HTMLUListElement>,
	poll?: Poll | null
}

export enum PollStatut
{
	REGISTER,
	VOTE,
	RESULT
}

export const defaultPoll: Poll = {
	id: 0,
	question: "",
	entries: [{value: "", voteCount: 0}, {value: "", voteCount: 0}, {value: "", voteCount: 0}],
	users: [],
	isVoted: false
};

const linearProgressAnim: Variants = {
	initial: {
		width: 0
	},
	enter: {
		width: "100%",
		transition: {
			duration: 2
		}
	}
};

/**
 * Poll component linked to an API.
 * - Create
 * - Vote
 * - Results
 */
export class PollCard extends Component<PollProps, PollState>
{
	state = {
		poll: this.props.poll ?? defaultPoll,
		statut: this.props.statut,
		radioValue: undefined,
		errorMessage: "",
		registerList: createRef<HTMLUListElement>()
	};

	/**
	 * Check if poll statut changed.
	 * @param prevProps - The previous props.
	 */
	public componentDidUpdate(prevProps: PollProps)
	{
		// update poll statut
		if (prevProps.statut !== this.props.statut
			|| prevProps.poll !== this.props.poll)
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				statut: this.props.statut,
				poll: this.props.poll
			}));
		}
	}

	/**
	 * Callback on vote change.
	 * @param event - The radio button sender.
	 * @param value - The vote index.
	 */
	public onVoteChange(event: React.ChangeEvent<HTMLInputElement>, value: string): void
	{
		event.persist();
		this.setState((prevState: PollState) => ({
			...prevState,
			radioValue: value
		}));
	}

	/**
	 * Callback on option input change.
	 * @param event - The input sender.
	 */
	public onOptionChange(event: React.ChangeEvent<HTMLInputElement>): void
	{
		event.persist();
		const inputs = Array.from(this.state.registerList.current!.childNodes)
			.map(li => li.firstChild?.firstChild?.firstChild) as HTMLInputElement[];

		const entries: PollEntry[] = inputs.map<PollEntry>(i => ({value: i.value, voteCount: 0}));
		// if all inputs are full, add a new one
		if (inputs.every(i => i.value))
			entries.push({value: "", voteCount: 0});

		// save all inputs
		this.setState((prevState: PollState) => ({
			...prevState,
			poll: {
				...this.state.poll,
				entries: entries
			}
		}));
	}

	/**
	 * Callback on pole title input change.
	 * @param event - The input change.
	 */
	public onTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>): void
	{
		event.persist();
		this.setState((prevState: PollState) => ({
			...prevState,
			poll: {
				...this.state.poll,
				question: event.target?.value
			}
		}));
	}

	/**
	 * On poll submit.
	 * @param event - The form sender.
	 */
	public onSubmit(event: React.FormEvent<HTMLFormElement>): void
	{
		event.preventDefault();

		// clear error message
		this.setState((prevState: PollState) => ({
			...prevState,
			errorMessage: ""
		}));

		// handle the right submission
		switch (this.state.statut)
		{
			case PollStatut.REGISTER: 	this.submitRegister(); 	break;
			case PollStatut.VOTE: 		this.submitVote(); 		break;
		}
	}

	/**
	 * Poll register submission.
	 */
	public async submitRegister(): Promise<void>
	{
		// pole name is empty
		if (!this.state.poll.question)
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: "Please enter a pole question!"
			}));
			return;
		}

		const inputs = Array.from(this.state.registerList.current!.childNodes)
			.map(li => li.firstChild?.firstChild?.firstChild) as HTMLInputElement[];
		// pole options are empty
		if (inputs.every(i => !i.value))
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: "Please add atleast one poll option!"
			}));
			return;
		}

		// create the poll
		const response: PollCreateAPI | null = await PollRepository.getInstance().add(this.state.poll);
		if (!response || response && !response.success) // request failed
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: response?.error
			}));
			return;
		}

		// change the pole statut to VOTE & refresh data
		if (this.props.onStatutChange && response.poll.id)
			this.props.onStatutChange(PollStatut.VOTE, response.poll.id);
		else
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				statut: PollStatut.VOTE,
				poll: response.poll
			}));
		}
	}

	/**
	 * Poll vote submission.
	 */
	public async submitVote(): Promise<void>
	{
		// is radio button selected
		if (!this.state.radioValue)
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: "Please select one option to vote!"
			}));
			return;
		}

		// update the poll vote
		const response: PollCreateAPI | null = await PollRepository.getInstance()
			.update(this.state.poll, this.state.radioValue!);
		if (!response || response && !response.success) // request failed
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: response?.error
			}));
			return;
		}

		// change the pole statut to RESULT & refresh data
		if (this.props.onStatutChange && response.poll.id)
			this.props.onStatutChange(PollStatut.RESULT, response.poll.id);
		else
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				statut: PollStatut.RESULT,
				poll: response.poll
			}));
		}
	}

	/**
	 * Compute the percent of an entry.
	 * @param entryVoteCount - The entry vote count.
	 */
	public computeEntryPercent(entryVoteCount: number): number
	{
		const sum: number = this.state.poll.entries
			.map<number>(e => e.voteCount)
			.reduce<number>((a, b) => a + b, 0);
		const percent = (entryVoteCount / sum) * 100;
		return Math.round(percent * 100) / 100;
	}

	public render(): JSX.Element
	{
		const resultPoll: JSX.Element = (
			<>
				<FormLabel className={"poll-header"} component="legend">
					<Typography variant={"h3"} component={"h3"}>
						{this.state.poll?.question}
					</Typography>
				</FormLabel>
				<ul className={"poll-section"}>
					{this.state.poll?.entries.map((entry: PollEntry) => {
						const entryPercent = this.computeEntryPercent(entry.voteCount);
						return (
							<li className={"poll-entry-result"} key={uuid.v4()}>
								<Grid component={"div"} container justify={"space-between"}
									  alignItems={"center"} direction={"row"}>
									<Typography variant={"h5"} component={"span"}>
										{entry.value}
									</Typography>
									<Typography variant={"h5"} component={"span"}>
										{`${entry.voteCount || 0} Votes`}
									</Typography>
								</Grid>
								<Grid container>
									<Grid item xs={9} sm={10} md={11}>
										<motion.div initial={"initial"} animate={"enter"} variants={linearProgressAnim}>
											<LinearProgress className={"poll-entry-result-progress"}
												variant="determinate" value={entryPercent} />
										</motion.div>
									</Grid>
									<Grid item xs={3} sm={2} md={1}>
										<Typography className={"poll-entry-result-percent"}
											variant={"h5"} component={"h5"}>
											{`${entryPercent}%`}
										</Typography>
									</Grid>
								</Grid>
							</li>
						);
					})}
				</ul>
			</>
		);

		const registerPoll: JSX.Element = (
			<>
				<FormLabel className={"poll-header"} component="legend">
					<Typography variant={"h3"} component={"h3"}>
						<TextareaAutosize color={"secondary"} placeholder={"Type your question here"}
								   onChange={this.onTitleChange.bind(this)} />
					</Typography>
				</FormLabel>
				<ul className={"poll-section"} ref={this.state.registerList}>
					{this.state.poll?.entries.map((entry: PollEntry, index: number) => (
						<li key={index} className={"poll-entry-input"}>
							<TextField fullWidth color={"secondary"} placeholder={"Enter poll option"}
									   onChange={this.onOptionChange.bind(this)} />
						</li>
					))}
				</ul>
				<Button type={"submit"} className={"poll-submit"} variant={"contained"}
						color={"secondary"} size={"large"}>
					Create
				</Button>
			</>
		);

		const votePoll: JSX.Element = (
			<>
				<FormLabel className={"poll-header"} component="legend">
					<Typography variant={"h3"} component={"h3"}>
						{this.state.poll?.question}
					</Typography>
				</FormLabel>
				<RadioGroup className={"poll-section"} aria-label="poll" name="poll"
							onChange={this.onVoteChange.bind(this)}>
					<ul>
						{this.state.poll?.entries.map((entry: PollEntry, index: number) => (
							<li className={"poll-entry-vote"} key={uuid.v4()}>
								<FormControlLabel value={index.toString()} control={<Radio />} label={entry.value} />
							</li>
						))}
					</ul>
					<Button type={"submit"} className={"poll-submit"} variant={"contained"}
							color={"secondary"} size={"large"}>
						Vote
					</Button>
				</RadioGroup>
			</>
		);

		return (
			<FormControl className={`poll ${this.props.className}`} component="form" onSubmit={this.onSubmit.bind(this)}>
				{this.state.statut === PollStatut.RESULT ? resultPoll : null}
				{this.state.statut === PollStatut.REGISTER ? registerPoll : null}
				{this.state.statut === PollStatut.VOTE ? votePoll : null}
				<Typography className={"poll-error"} variant={"h6"} component={"h6"}>
					{this.state.errorMessage}
				</Typography>
			</FormControl>
		);
	}
}

export default memo(PollCard);