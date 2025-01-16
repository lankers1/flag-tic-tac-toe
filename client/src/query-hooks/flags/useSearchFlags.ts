import { useQuery } from '@tanstack/react-query';

async function handleSearchFlags(searchTerm: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/search_flags`, {
    method: 'POST',
    body: JSON.stringify({ search_term: searchTerm })
  });
  return await res.json();
}

export const useSearchFlagsQuery = (searchTerm: string) =>
  useQuery<Flag[], void>({
    queryKey: [searchTerm],
    queryFn: () => handleSearchFlags(searchTerm)
  });
