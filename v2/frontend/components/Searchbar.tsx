import React, { FormEvent, useEffect, useState } from "react";
import { Building } from "./Building";
import BuildingCard from "./BuildingCard";

const Searchbar = () => {
  const [roomsFound, setRoomsFound] = useState<Building[]>([]);
  const [roomSearch, setRoomSearch] = useState("");

  const searchRoom = async (query: string): Promise<Building[]> => {
    const result = await fetch(`http://localhost:3001/?search=${query}`);
    return (await result.json()).results;
  };

  const search = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const input = form.querySelector("#searchText") as HTMLInputElement;
    setRoomSearch(input.value);
  };

  useEffect(() => {
    (async () => {
      const query = encodeURIComponent(roomSearch);
      const response = await searchRoom(query);
      setRoomsFound(response);
    })();
  }, [roomSearch]);

  return (
    <div className="search-bar">
      <form className="searchForm" onSubmit={(event) => search(event)}>
        <input id="searchText" type="text" />
        <button>Search</button>
      </form>
      <div className="card-container">
        {roomsFound.map((building) => (
          <BuildingCard key={building.href} building={building}></BuildingCard>
        ))}
      </div>
      {roomSearch && <p>Results for {roomSearch}...</p>}
    </div>
  );
};

export default Searchbar;
