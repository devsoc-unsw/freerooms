import { Building } from "./Building";

const BuildingCard = (props: { building: Building }) => {
  const { building } = props;
  return (
    <div className="building">
      <div className="title">
        <img
          src={building.thumbnail || "http://localhost:3000/placeholder.jpg"}
          alt={building.title}
        />
        <p>{building.title}</p>
      </div>
      <a href={building.href} target="_blank">
        Have a look now
      </a>
    </div>
  );
};

export default BuildingCard;
