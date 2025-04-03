import { useQuery } from '@tanstack/react-query';
import { FlagCharacteristics } from '@type-defs/flag';

async function handleSearchFlagCharacteristics(
  searchTerm: string,
  characteristics: string[]
) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/search_flag_characteristics`,
    {
      method: 'POST',
      body: JSON.stringify({ search_term: searchTerm, characteristics })
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return await res.json();
}

export const useSearchFlagCharacteristicsQuery = (
  searchTerm: string,
  characteristics: string[]
) =>
  useQuery<FlagCharacteristics[]>({
    queryKey: ['search-flags', searchTerm, ...characteristics],
    queryFn: () => handleSearchFlagCharacteristics(searchTerm, characteristics)
  });
