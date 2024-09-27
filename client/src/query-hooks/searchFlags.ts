import { useMutation } from "@tanstack/react-query";

export const searchFlags = () =>
  useMutation<Flag[], void, string>({
    mutationFn: async (search_term: string) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/search_flags`, {
        method: "POST",
        body: JSON.stringify({ search_term }),
      });
      return await res.json();
    },
  });
