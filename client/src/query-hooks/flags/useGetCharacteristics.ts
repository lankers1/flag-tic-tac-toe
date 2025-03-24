import { useQuery } from '@tanstack/react-query';

async function handleGetCharacteristics() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/characteristics`);
  if (!res.ok) {
    const response = await res.json();
    throw new Error(response);
  }
  return await res.json();
}

export const useGetCharacteristicsQuery = () => {
  return useQuery({
    queryKey: ['characteristics'],
    queryFn: handleGetCharacteristics,
    refetchOnWindowFocus: false
  });
};
