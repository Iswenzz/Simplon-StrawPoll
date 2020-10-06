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
	Typography, InputBase, TextareaAutosize
} from "@material-ui/core";
import "./Poll.scss";

export interface PollEntry
{
	name: string,
	voteCount?: number
}

export interface PollProps
{
	className?: string,
	style?: React.CSSProperties,
	entries?: PollEntry[],
	name?: string,
	statut: PollStatut
}

export interface PollState
{
	entries: PollEntry[],
	name?: string,
	value?: string,
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
			? [{name: ""}, {name: ""}, {name: ""}] : this.props.entries || [],
		name: this.props.statut === PollStatut.REGISTER ? "" : this.props.name,
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
			value: value
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

		const entries: PollEntry[] = inputs.map<PollEntry>(i => ({name: i.value}));
		// if all inputs are full, add a new one
		if (inputs.every(i => i.value))
			entries.push({name: ""});

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
			name: event.target?.value
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
	public submitRegister(): void
	{
		// pole name is empty
		if (!this.state.name)
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
						{this.state.name}
					</Typography>
				</FormLabel>
				<ul className={"poll-section"}>
					{this.state.entries.map((entry: PollEntry) => (
						<li className={"poll-entry"} key={entry.name}>
							<Grid component={"div"} container justify={"space-between"}
								  alignItems={"center"} direction={"row"}>
								<Typography variant={"h5"} component={"span"}>
									{entry.name}
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
						<li key={index} className={"poll-input"}>
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
						{this.state.name}
					</Typography>
				</FormLabel>
				<RadioGroup className={"poll-section"} aria-label="poll" name="poll"
							onChange={this.voteChange.bind(this)}>
					<ul>
						{this.state.entries.map((entry: PollEntry, index: number) => (
							<li className={"poll-entry"} key={entry.name}>
								<FormControlLabel value={index.toString()} control={<Radio />} label={entry.name} />
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