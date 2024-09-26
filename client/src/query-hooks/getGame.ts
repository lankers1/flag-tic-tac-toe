import { useQuery } from "@tanstack/react-query";

async function getGame() {
  const res = await fetch(`${import.meta.env.API_URL}/game`);
  return await res.json();
}

export const getGameQuery = useQuery({ queryKey: ["game"], queryFn: getGame });
