import { useQuery } from "@tanstack/react-query";

export const useSearchFlags = (search_term: string) =>
  useQuery<Flag[], void>({
    queryKey: [search_term],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/search_flags`, {
        method: "POST",
        body: JSON.stringify({ search_term }),
      });
      return await res.json();
    },
  });
