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
	Typography, TextareaAutosize
} from "@material-ui/core";
import axios from "axios";
import "./Poll.scss";

export interface PollEntry
{
	value: string,
	voteCount?: number
}

export interface PollProps
{
	className?: string,
	style?: React.CSSProperties,
	entries?: PollEntry[],
	question?: string,
	statut: PollStatut
}

export interface PollState
{
	entries: PollEntry[],
	question?: string,
	radioValue?: string,
	statut: PollStatut,
	errorMessage?: string,
	registerList: React.RefObject<HTMLUListElement>
}

export enum PollStatut
{
	REGISTER,
	VOTE,
	RESULT
}

export class Poll extends Component<PollProps, PollState>
{
	state = {
		entries: this.props.statut === PollStatut.REGISTER
			? [{value: ""}, {value: ""}, {value: ""}] : this.props.entries || [],
		question: this.props.statut === PollStatut.REGISTER ? "" : this.props.question,
		statut: this.props.statut,
		value: undefined,
		errorMessage: "",
		registerList: createRef<HTMLUListElement>()
	};

	/**
	 * Callback on vote change.
	 * @param event - The radio button sender.
	 * @param value - The vote index.
	 */
	public voteChange(event: React.ChangeEvent<HTMLInputElement>, value: string): void
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

		const entries: PollEntry[] = inputs.map<PollEntry>(i => ({value: i.value}));
		// if all inputs are full, add a new one
		if (inputs.every(i => i.value))
			entries.push({value: ""});

		// save all inputs
		this.setState((prevState: PollState) => ({
			...prevState,
			entries: entries
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
			question: event.target?.value
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
	 * @TODO backend
	 */
	public async submitRegister(): Promise<void>
	{
		// pole name is empty
		if (!this.state.question)
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
		try
		{
			const response = await axios.post("http://localhost:8000/poll/create", {
				question: this.state.question,
				entries: this.state.entries
			});

			// request failed
			if (!response.data.success)
			{
				this.setState((prevState: PollState) => ({
					...prevState,
					errorMessage: response.data.error
				}));
			}
		}
		catch (e)
		{
			console.log(e);
		}
	}

	/**
	 * Poll vote submission.
	 * @TODO backend
	 */
	public submitVote(): void
	{
		// is radio button selected
		if (!this.state.value)
		{
			this.setState((prevState: PollState) => ({
				...prevState,
				errorMessage: "Please select one option to vote!"
			}));
			return;
		}
	}

	public render(): JSX.Element
	{
		const resultPoll: JSX.Element = (
			<>
				<FormLabel className={"poll-header"} component="legend">
					<Typography variant={"h3"} component={"h3"}>
						{this.state.question}
					</Typography>
				</FormLabel>
				<ul className={"poll-section"}>
					{this.state.entries.map((entry: PollEntry) => (
						<li className={"poll-entry-result"} key={entry.value}>
							<Grid component={"div"} container justify={"space-between"}
								  alignItems={"center"} direction={"row"}>
								<Typography variant={"h5"} component={"span"}>
									{entry.value}
								</Typography>
								<Typography variant={"h5"} component={"span"}>
									{entry.voteCount || 0}
								</Typography>
							</Grid>
						</li>
					))}
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
					{this.state.entries.map((entry: PollEntry, index: number) => (
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
						{this.state.question}
					</Typography>
				</FormLabel>
				<RadioGroup className={"poll-section"} aria-label="poll" name="poll"
							onChange={this.voteChange.bind(this)}>
					<ul>
						{this.state.entries.map((entry: PollEntry, index: number) => (
							<li className={"poll-entry-vote"} key={entry.value}>
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

export default memo(Poll);