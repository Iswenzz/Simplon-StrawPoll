import React, {FunctionComponent} from "react";
import NavBar from "../UI/NavBar/NavBar";
import Footer from "../UI/Footer/Footer";
import "./Home.scss";

export const Home: FunctionComponent = (): JSX.Element =>
{
	return (
		<>
			<NavBar />
			<Footer />
		</>
	);
};

export default Home;