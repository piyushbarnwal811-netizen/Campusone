const Card = ({ title, value, subtitle }) => {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="card-value">{value}</p>
      {subtitle ? <small>{subtitle}</small> : null}
    </div>
  );
};

export default Card;
