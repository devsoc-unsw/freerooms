import useSWR from "swr";

const useBuildings = () => {
  const { data, error } = useSWR(`http://localhost:3000/buildings`);

  return {
    buildings: data,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useBuildings;
