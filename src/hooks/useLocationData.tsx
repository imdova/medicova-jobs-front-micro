import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCountries,
  fetchStates,
  fetchStatesByCountries,
} from "@/store/slices/locationSlice";
import { useEffect, useState } from "react";

export const useLocationData = (selectedCountryCode?: string | string[]) => {
  const dispatch = useAppDispatch();
  const { countries, states } = useAppSelector((state) => state.location);
  const [cachedCountry, setCached] = useState<string | string[] | null>(null);

  useEffect(() => {
    if (countries.data.length === 0 && !countries.loading) {
      dispatch(fetchCountries());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (JSON.stringify(selectedCountryCode) === JSON.stringify(cachedCountry))
      return;
    if (Array.isArray(selectedCountryCode)) {
      dispatch(fetchStatesByCountries(selectedCountryCode));
      setCached(selectedCountryCode);
    } else if (selectedCountryCode) {
      setCached(selectedCountryCode);
      dispatch(fetchStates(selectedCountryCode));
    }
  }, [dispatch, selectedCountryCode, cachedCountry]);

  return {
    countries: countries.data,
    states: selectedCountryCode ? states.data : [],
  };
};
