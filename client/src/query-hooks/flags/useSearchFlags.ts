import { useQuery } from '@tanstack/react-query';

async function handleSearchFlags(searchTerm: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/search_flags`, {
    method: 'POST',
    body: JSON.stringify({ search_term: searchTerm })
  });

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return await res.json();
}

export const useSearchFlagsQuery = (searchTerm: string) =>
  useQuery<Flag[]>({
    queryKey: [searchTerm],
    queryFn: () => handleSearchFlags(searchTerm)
  });
