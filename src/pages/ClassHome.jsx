import "../styles/ClassHome.css";
import Header from "../components/Header";
import BaseHero from "../components/BaseHero";
import ClassHomeHero from "../components/ClassHomeHero";
import Classes from "../components/Classes";
import FavoriteClasses from "../components/FavoriteClasses";
import graph_Circle from "../assets/SVG_Main/graph_Circle.svg";
import graph_Line from "../assets/SVG_Main/graph_Line.svg";
import AvatarGroup from "../components/AvatarGroup";

const ClassHome = () => {
  const bg = (
    <>
      <img
        src={graph_Circle}
        style={{
          position: "absolute",
          left: 70,
          top: 123,
          width: 118,
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

  return (
    <div className="ClassHome">
      <BaseHero bg={bg}>
        <Header />
        <ClassHomeHero />
      </BaseHero>
      <Classes />
    </div>
  );
};

export default ClassHome;
