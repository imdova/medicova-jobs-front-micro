"use server";

import {
  API_GET_CITIES,
  API_GET_COUNTRIES,
  API_GET_STATES,
} from "@/api/general";
import { City, Country, Result, State } from "@/types";

export const getStateList = async (
  countryCode: string,
): Promise<Result<State[]>> => {
  try {
    const response = await fetch(
      API_GET_STATES + `?countryCode=${countryCode}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
      },
    );
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "State list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export const getCountryList = async (): Promise<Result<Country[]>> => {
  try {
    const response = await fetch(API_GET_COUNTRIES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "Country list fetched successfully",
        data: data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};

export const getCityList = async (
  countryCode: string,
  stateCode?: string,
): Promise<Result<City[]>> => {
  try {
    let url = `${API_GET_CITIES}?countryCode=${countryCode}`;
    if (stateCode) {
      url += `&stateCode=${stateCode}`;
    }
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        message: "City list fetched successfully",
        data: data.data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "An error occurred",
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "An error occurred",
    };
  }
};
