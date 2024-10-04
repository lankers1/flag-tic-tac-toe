import { useQuery } from "@tanstack/react-query";

async function getGame() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/game`);
  return await res.json();
}

export const useGetGameQuery = () =>
  useQuery({
    queryKey: ["game"],
    gcTime: 0,
    queryFn: getGame,
    refetchOnWindowFocus: false,
  });
