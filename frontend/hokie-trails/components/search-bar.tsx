import React, { useState, useEffect, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';

interface Props {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}

const AutocompleteInput: React.FC<Props> = ({ onPlaceSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const options = {
        // Restrict the autocomplete to address-related results
        types: ['address'],
        // Restrict to a specific country (optional)
        componentRestrictions: { country: 'us' }
      };

      autocompleteRef.current = new google.maps.places.Autocomplete(
        document.getElementById('autocomplete-input') as HTMLInputElement,
        options
      );

      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place) {
          onPlaceSelected(place);
        }
      });
    }
  }, []);

  return (
    <div>
      <input
        id="autocomplete-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter an address"
      />
    </div>
  );
};

export default AutocompleteInput;