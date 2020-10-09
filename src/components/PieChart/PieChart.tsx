import {PieChart as ReactPieChart} from "react-minimal-pie-chart";
import {createMuiTheme, MuiThemeProvider, PopperProps, Tooltip} from "@material-ui/core";
import React, {memo, PureComponent} from "react";
import {Point2D} from "framer-motion";
import "./PieChart.scss";

const dataMock: PieChartEntry[] = [
	{ tooltipText: "One", value: 10, color: "#E38627" },
	{ tooltipText: "Two", value: 15, color: "#C13C37" },
	{ tooltipText: "Three", value: 20, color: "#6A2135" },
];

export interface PieChartEntry
{
	title?: string,
	value: number,
	color: string,
	tooltipText: string
}

export interface PieChartProps
{
	data?: PieChartEntry[],
	className?: string
}

export interface PieChartState
{
	data: PieChartEntry[],
	selectedEntry: number | null,
	tooltipState: Point2D
}

const tooltipTheme = (color: string) => {
	return createMuiTheme({
		overrides: {
			MuiTooltip: {
				tooltip: {
					backgroundColor: color,
					fontSize: "1em"
				},
				arrow: {
					color: color
				}
			}
		},
	});
};

/**
 * Pie chart with tooltip & animations.
 */
export class PieChart extends PureComponent<PieChartProps, PieChartState>
{
	state: PieChartState = {
		data: this.props.data ?? dataMock,
		selectedEntry: null,
		tooltipState: { x: 0, y: 0 }
	};

	/**
	 * Set the selected chart segment.
	 * @param index - The segment index.
	 */
	public setHovered(index: number | null): void
	{
		this.setState((prevState: PieChartState) => ({
			...prevState,
			selectedEntry: index
		}));
	}

	/**
	 * Set the tooltip position.
	 * @param event - The mouse move event.
	 */
	public setPosition(event: React.MouseEvent)
	{
		event.persist();
		this.setState((prevState: PieChartState) => ({
			...prevState,
			tooltipState: {
				x: event.clientX,
				y: event.clientY + 10
			}
		}));
	}

	/**
	 * Update the tooltip popper position.
	 */
	public computeTooltipPosition(): Partial<PopperProps>
	{
		return {
			anchorEl: {
				clientHeight: 0,
				clientWidth: 0,
				getBoundingClientRect: () => ({
					top: this.state.tooltipState.y,
					left: this.state.tooltipState.x,
					right: this.state.tooltipState.x,
					bottom: this.state.tooltipState.y,
					width: 0,
					height: 0,
				})
			}
		};
	}

	public render(): JSX.Element
	{
		return (
			<MuiThemeProvider theme={tooltipTheme(this.state.selectedEntry !== null ?
				this.state.data[this.state.selectedEntry].color : "transparent")}>
				<Tooltip arrow onMouseMove={this.setPosition.bind(this)}
						 title={this.state.selectedEntry !== null ?
							 this.state.data[this.state.selectedEntry].tooltipText : ""}
						 PopperProps={this.computeTooltipPosition()}>
					<div>
						<ReactPieChart className={`piechart ${this.props.className}`} data={this.state.data}
							label={({ dataEntry }) => dataEntry.value > 0 ? `${dataEntry.value}%` : ""} lineWidth={80}
							onMouseOut={() => this.setHovered(null)} onMouseOver={(_, i) => this.setHovered(i)} />
					</div>
				</Tooltip>
			</MuiThemeProvider>
		);
	}
}

export default memo(PieChart);