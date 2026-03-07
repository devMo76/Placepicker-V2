# PlacePicker V2

A React application that lets users build a personal collection of places they would like to visit. Places are sorted by proximity to the user's location using the Geolocation API, and selections are persisted to a backend server.

## Tech Stack

- **Frontend:** React 19, Vite
- **Backend:** Node.js, Express

## Project Structure

```
├── src/
│   ├── App.jsx                  # Root component — manages user places and modals
│   ├── http.js                  # HTTP utility functions (fetch & update places)
│   ├── loc.js                   # Haversine distance calculation & sorting
│   ├── Hooks/
│   │   └── useFetch.js          # Custom hook for data fetching
│   └── components/
│       ├── AvailablePlaces.jsx  # Displays all places sorted by distance
│       ├── Places.jsx           # Reusable place list with loading/fallback states
│       ├── Modal.jsx            # Dialog modal using React portals
│       ├── DeleteConfirmation.jsx # Timed confirmation prompt
│       ├── ProgressBar.jsx      # Animated countdown bar
│       └── Error.jsx            # Reusable error display
├── backend/
│   ├── app.js                   # Express server with REST endpoints
│   └── data/
│       ├── places.json          # All available places
│       └── user-places.json     # User-selected places (persisted)
```

## React Concepts Used

### Custom Hooks (`useFetch`)

A reusable `useFetch` hook encapsulates the entire data-fetching lifecycle — loading state, fetched data, and error handling — into a single abstraction. It accepts a fetch function and an initial value, then exposes `isFetching`, `fetchedData`, `errorMessage`, and the `setFetchedData` setter so consumers can also update the data optimistically.

Both `App.jsx` and `AvailablePlaces.jsx` consume this hook, using **destructuring with renaming** to give the generic return values domain-specific names (e.g. `fetchedData: userPlaces`).

### Optimistic Updating

When a user selects or removes a place, the UI updates immediately via `setUserPlaces` before the backend request completes. If the request fails, the state is rolled back to the previous value — giving instant feedback while still keeping the server as the source of truth.

### `useEffect` and Side Effects

- `useFetch` uses `useEffect` to trigger data fetching when the component mounts.
- `Modal` uses `useEffect` to imperatively call `showModal()` / `close()` on the native `<dialog>` element in sync with the `open` prop.
- `DeleteConfirmation` uses `useEffect` with a `setTimeout` to auto-confirm deletion after a countdown, with proper cleanup via `clearTimeout`.
- `ProgressBar` uses `useEffect` with `setInterval` to animate a countdown bar, with proper cleanup via `clearInterval`.

### `useCallback`

`handleRemovePlace` in `App.jsx` is wrapped in `useCallback` to produce a stable function reference. This prevents unnecessary re-renders of child components (like `DeleteConfirmation`) that depend on this handler and use it inside their own `useEffect` dependency arrays.

### `useRef`

- `selectedPlace` in `App.jsx` stores a reference to the currently selected place without causing re-renders when it changes.
- `dialog` in `Modal.jsx` holds a ref to the native `<dialog>` DOM element for imperative access (`showModal()` / `close()`).

### React Portals (`createPortal`)

The `Modal` component uses `createPortal` to render the `<dialog>` element into a dedicated `#modal` DOM node outside the main component tree, ensuring correct overlay stacking and accessibility.

### Conditional Rendering

Used throughout the app to show loading indicators, fallback text, error messages, or content depending on the current state (e.g. `isFetching`, `errorMessage`, empty lists).

### Component Composition

The app is broken into focused, reusable components. `Places` is a generic list renderer reused for both user-selected and available places. `Modal` wraps any children as dialog content. `Error` is a shared error display used in multiple contexts.

## Backend

A lightweight Express server with three endpoints:

| Method | Route          | Description                      |
|--------|----------------|----------------------------------|
| GET    | `/places`      | Returns all available places     |
| GET    | `/user-places` | Returns user-selected places     |
| PUT    | `/user-places` | Updates user-selected places     |

Data is stored as JSON files on disk. CORS headers are configured to allow cross-origin requests from the Vite dev server.

## Getting Started

1. **Start the backend:**
   ```bash
   cd backend
   npm install
   node app.js
   ```

2. **Start the frontend:**
   ```bash
   npm install
   npm run dev
   ```

3. Open the app at the URL shown by Vite (typically `http://localhost:5173`).
