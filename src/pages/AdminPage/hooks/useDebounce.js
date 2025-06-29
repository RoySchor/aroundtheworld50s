import { useState, useEffect } from "react";

/**
 * Custom hook that debounces a value
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timer if the value changes before the delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook that provides smart debouncing for different field types
 * @param {object} formData - The form data object
 * @returns {object} - The debounced form data
 */
export const useSmartDebounce = (formData) => {
  // Text fields get debounced
  const debouncedTextFields = useDebounce(
    {
      blog_header: formData.blog_header,
      blog_subtitle: formData.blog_subtitle,
      blog_description_detailed: formData.blog_description_detailed,
      blog_tips_section: formData.blog_tips_section,
      blog_tips_link: formData.blog_tips_link,
      title: formData.title,
      country: formData.country,
    },
    300,
  );

  // Content sections get debounced (for text content)
  const debouncedContentSections = useDebounce(
    formData.content_sections?.map((section) => ({
      ...section,
      content: section.content, // This will be debounced
    })) || [],
    300,
  );

  // Immediate fields (no debouncing needed)
  const immediateFields = {
    country_code: formData.country_code,
    state: formData.state,
    blog_description: formData.blog_description,
    background_image: formData.background_image,
    include_itineraries: formData.include_itineraries,
    itineraries: formData.itineraries,
    include_maps: formData.include_maps,
    maps: formData.maps,
    include_content: formData.include_content,
  };

  // Combine debounced and immediate fields
  return {
    ...immediateFields,
    ...debouncedTextFields,
    content_sections: debouncedContentSections,
  };
};
