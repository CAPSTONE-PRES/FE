import "../styles/BaseHero.css";

const BaseHero = ({ children, bg }) => {
  return (
    <div>
      <section className="BaseHero">
        {bg ? <div className="baseHero_bg">{bg}</div> : null}
        <div className="baseHero_inner">{children}</div>
      </section>
    </div>
  );
};

export default BaseHero;
