import { useState } from "react";
import { Gameboard } from "../../components/Gameboard";
import { useGetGameQuery } from "../../query-hooks/getGame";
import { Modal } from "../../components/Modal";
import { IoClose } from "react-icons/io5";
import { SearchInput } from "../../components/Inputs/SearchInput";
import { useMutation } from "@tanstack/react-query";
import { debounce } from "../../utils/debounce";

export const Game = () => {
  const [selectedSquare, setSelectedSquare] = useState<null | number>(null);
  const { data, isLoading, isPending, error } = useGetGameQuery();

  const { data: flags, mutate } = useMutation({
    mutationFn: async (search) => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/search_flags`, {
        method: "POST",
        body: JSON.stringify({ search_term: search.search_term }),
      });
      return await res.json();
    },
  });

  if (isLoading || isPending) return <p>loading...</p>;
  if (error) return <p>Error... {error.message}</p>;

  function handleClick(index: number) {
    setSelectedSquare(index + 1);
  }

  const handleSearch = debounce(
    (event) => mutate({ search_term: event.target.value }),
    1000
  );
  console.log(flags);
  return (
    <>
      <Gameboard handleClick={handleClick} data={data} />
      <Modal isOpen={!!selectedSquare}>
        <div
          style={{
            height: "100%",
          }}
        >
          <div
            style={{
              justifyContent: "space-between",
              gap: "18px",
              display: "flex",
            }}
          >
            <SearchInput handleSearch={handleSearch} />
            <button
              onClick={() => setSelectedSquare(null)}
              style={{
                display: "inline-flex",
                borderRadius: "28px",
                backgroundColor: "white",
                boxShadow: "3px 3px rgba(0,0,0,0.5)",
                cursor: "pointer",
              }}
            >
              <IoClose
                style={{
                  height: "1.25rem",
                  width: "1.25rem",
                  padding: "0.5rem",
                }}
              />
            </button>
          </div>
          <div>
            <ul>
              {flags?.map((flag) => (
                <li>{flag.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </>
  );
};
