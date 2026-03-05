import { useState } from "react";
import { useEffect } from "react";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [errorMessage, setErrorMessage] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setIsFetching(true);

      try {
        const places = await fetchAvailablePlaces();
        navigator.geolocation.getCurrentPosition((postion) => {
          const sortedPlaces = sortPlacesByDistance(
            places,
            postion.coords.latitude,
            postion.coords.longitude,
          );
          setAvailablePlaces(sortedPlaces);
          setIsFetching(false);
        });
      } catch (error) {
        setErrorMessage({
          message:
            error.message ||
            "Couldnt fetch the data from the source. Try again later",
        });
        setIsFetching(false);
      }
    }

    fetchPlaces();
  }, []);

  if (errorMessage) {
    return (
      <ErrorPage title="An error occured" message={errorMessage.message} />
    );
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data.."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
