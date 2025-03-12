import { AuthContext } from '@context/AuthContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useContext } from 'react';

interface Args {
  username: string | undefined;
  token: string | undefined;
  favouriteFlag: string;
}

async function handleUpdateFavouriteFlag({
  username,
  token,
  favouriteFlag
}: Args) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/user/${username}/flag`,
    {
      method: 'PATCH',
      body: JSON.stringify({ token, favouriteFlag })
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw Error(error);
  }

  return res.json();
}

export const useUpdateFavouriteFlagQuery = () => {
  const queryClient = useQueryClient();
  const user = useContext(AuthContext);

  return useMutation({
    mutationFn: handleUpdateFavouriteFlag,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['user', data.username] });
      user?.setUser({
        ...user,
        favouriteFlag: data.favouriteFlag
      });
    }
  });
};
