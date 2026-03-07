import { useState, useEffect } from "react";

export function useFetch(fetchfn, initialVal) {
  const [isFetching, setIsFetching] = useState();
  const [errorMessage, setErrorMessage] = useState();
  const [fetchedData, setFetchedData] = useState(initialVal);

  useEffect(() => {
    async function fetchData() {
      setIsFetching(true);
      try {
        const data = await fetchfn();
        setFetchedData(data);
      } catch (error) {
        setErrorMessage({
          message: error.message || "Failed to fetch data",
        });
      }
      setIsFetching(false);
    }

    fetchData();
  }, [fetchfn]);

  return {
    isFetching,
    fetchedData,
    errorMessage,
    setFetchedData,
  };
}
