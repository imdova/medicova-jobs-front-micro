"use client";
import { useState, useEffect } from "react";

type UseImageValidationResult = {
  isValid: boolean | null; // null indicates that the validation hasn't occurred yet
  isLoading: boolean;
};

const useImageValidation = (
  imageUrl: string | null | undefined,
): UseImageValidationResult => {
  const [isValid, setIsValid] = useState<boolean | null>(null); // null indicates validation hasn't happened yet
  const [isLoading, setIsLoading] = useState<boolean>(true); // loading state

  useEffect(() => {
    // If imageUrl is null or undefined, skip validation
    if (!imageUrl) {
      setIsValid(null);
      setIsLoading(false);
      return;
    }

    const img = new Image();

    // Reset validation state for a new image URL
    setIsValid(null);
    setIsLoading(true);
    // Set the image's src and check its validity
    img.src = imageUrl;

    // On successful image load
    img.onload = () => {
      setIsValid(true);
      setIsLoading(false);
    };

    // On error loading the image
    img.onerror = () => {
      setIsValid(false);
      setIsLoading(false);
    };

    // Clean up when the component is unmounted or image URL changes
    return () => {
      setIsLoading(false); // In case the component unmounts during image load
    };
  }, [imageUrl]);

  return { isValid, isLoading };
};

export default useImageValidation;
