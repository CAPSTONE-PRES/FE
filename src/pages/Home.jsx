import "../styles/Home.css";
import Header from "../components/Header";
import HomeHero from "../components/HomeHero";
import BaseHero from "../components/BaseHero";
import FavoriteClasses from "../components/FavoriteClasses";
import Presentations from "../components/Presentations";
import circle_Bg from "../assets/SVG_Main/circle_Bg.svg";
import graph_Circle from "../assets/SVG_Main/graph_Circle.svg";
import graph_Line from "../assets/SVG_Main/graph_Line.svg";
import { useContext } from "react";
import { DataContext } from "../App";

const Home = () => {
  const bg = (
    <>
      <img
        src={circle_Bg}
        style={{
          position: "absolute",
          left: 0,
          top: -80,
        }}
      />
      <img
        src={graph_Circle}
        style={{
          position: "absolute",
          right: 393,
          top: 123,
        }}
      />
      <img
        src={graph_Line}
        style={{
          position: "absolute",
          right: 70,
          top: 93,
        }}
      />
    </>
  );

  const { loading } = useContext(DataContext);

  if (loading) {
    return <div>Loading..</div>;
  }

  return (
    <div className="Home">
      <BaseHero bg={bg}>
        <Header />
        <HomeHero />
      </BaseHero>
      <div className="fav-classes">
        <FavoriteClasses type={"HOME"} />
      </div>
      <div className="Home_presentations">
        <Presentations context="home" />
      </div>
    </div>
  );
};

export default Home;
