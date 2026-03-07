import { useFetch } from "../Hooks/useFetch.js";
import { sortPlacesByDistance } from "../loc.js";
import { fetchAvailablePlaces } from "../http.js";
import Places from "./Places.jsx";
import ErrorPage from "./Error.jsx";

async function fetchsortedPlaces() {
  const places = await fetchAvailablePlaces();

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition((postion) => {
      const sortedPlaces = sortPlacesByDistance(
        places,
        postion.coords.latitude,
        postion.coords.longitude,
      );
      return resolve(sortedPlaces);
    });
  });
}

export default function AvailablePlaces({ onSelectPlace }) {
  const {
    isFetching,
    fetchedData: availablePlaces,
    errorMessage,
  } = useFetch(fetchsortedPlaces, []);

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
