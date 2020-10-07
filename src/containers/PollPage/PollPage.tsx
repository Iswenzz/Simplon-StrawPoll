import React, {FunctionComponent} from "react";
import NavBar from "../UI/NavBar/NavBar";
import Footer from "../UI/Footer/Footer";
import PollForm from "./PollForm/PollForm";
import "./PollPage.scss";

export const PollPage: FunctionComponent = (): JSX.Element =>
{
	return (
		<>
			<NavBar />
			<PollForm />
			<Footer />
		</>
	);
};

export default PollPage;