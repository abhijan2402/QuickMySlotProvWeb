export function convertToIST(utcDateString) {
  if (!utcDateString) return "";

  // Parse UTC date
  const utcDate = new Date(utcDateString);

  // Convert to IST using Intl API
  const istDate = utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return istDate;
}

export function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Function to get Lat $ Long
export async function getLatLngFromAddress(address) {
  const apiKey = import.meta.env.VITE_MAP_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    } else {
      console.error("Geocoding failed:", data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    return null;
  }
}

export async function getCityAndAreaFromAddress(address) {
  const apiKey = import.meta.env.VITE_MAP_KEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const components = data.results[0].address_components;

      // Helper to find first component matching any of the types
      const findComponent = (types) =>
        components.find((comp) => types.some((t) => comp.types.includes(t)));

      // Find city/locality or fallback admin areas
      const cityComponent =
        findComponent(["locality"]) ||
        findComponent(["administrative_area_level_2"]) ||
        findComponent(["administrative_area_level_1"]);

      // Find smaller area like sublocality or neighborhood or route/premise
      const areaComponent = findComponent([
        "sublocality",
        "sublocality_level_1",
        "neighborhood",
        "route",
        "premise",
      ]);

      return {
        city: cityComponent ? cityComponent.long_name : null,
        area: areaComponent ? areaComponent.long_name : null,
      };
    } else {
      console.error("Geocoding failed:", data.status, data.error_message);
      return null;
    }
  } catch (error) {
    console.error("Error fetching geocode:", error);
    return null;
  }
}



