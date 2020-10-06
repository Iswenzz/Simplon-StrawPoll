import React, {Component} from "react";
import {Typography} from "@material-ui/core";
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
	name?: string
}

export interface PollState
{
	entries: PollEntry[],
	name?: string
}

export class Poll extends Component<PollProps, PollState>
{
	state = {
		entries: this.props.entries || [],
		name: this.props.name
	};

	public render(): JSX.Element
	{
		return (
			<article className={`poll ${this.props.className}`} style={this.props.style}>
				<header className={"poll-header"}>
					<Typography variant={"h3"} component={"h3"}>
						{this.state.name}
					</Typography>
				</header>
				<ul className={"poll-section"}>
					{this.state.entries.map((entry: PollEntry) => (
						<li key={entry.name}>
							<Typography variant={"h5"} component={"h5"}>
								{entry.name}
							</Typography>
						</li>
					))}
				</ul>
			</article>
		);
	}
}

export default Poll;