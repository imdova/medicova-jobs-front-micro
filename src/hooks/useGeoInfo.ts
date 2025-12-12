import { useEffect, useState } from "react";
type GeoInfo = {
  country_name: string;
  country_code2: string;
  region_name: string;
  city: string;
  latitude: number;
  longitude: number;
  isp: string;
};
const useGeoInfo = () => {
  const [data, setData] = useState<GeoInfo>({} as GeoInfo);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const getGeoInfo = async () => {
    try {
      setLoading(true);

      // First, get the user's IP address
      const ipResponse = await fetch("https://api64.ipify.org?format=json");
      const ipData = await ipResponse.json();
      const userIP = ipData.ip;

      // Then, use the IP address to fetch location details
      const geoResponse = await fetch(
        `https://api.iplocation.net/?ip=${userIP}`,
      );
      if (!geoResponse.ok) {
        throw new Error("Failed to fetch geolocation data");
      }
      const geoData = await geoResponse.json();
      setData(geoData);
    } catch (error) {
      setError("Error fetching geo info");
      console.log("Error fetching geo info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getGeoInfo();
  }, []);

  return { data, error, loading };
};

export default useGeoInfo;
