import { useQuery } from "@tanstack/react-query";

async function getGame() {
  return await fetch(`${import.meta.env.VITE_API_URL}/game`);
}

export const useGetGameQuery = () =>
  useQuery({
    queryKey: ["game"],
    queryFn: getGame,
  });
