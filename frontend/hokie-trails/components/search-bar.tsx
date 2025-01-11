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
            types: ['address'],
            componentRestrictions: { country: 'us' }
        };

        const input = document.getElementById('autocomplete-input') as HTMLInputElement;
        if (input) {
            autocompleteRef.current = new google.maps.places.Autocomplete(input, options);

            autocompleteRef.current.addListener('place_changed', () => {
                const place = autocompleteRef.current?.getPlace();
                if (place) {
                    // Make sure we have geometry before calling the callback
                    if (place.geometry && place.geometry.location) {
                        onPlaceSelected(place);
                        
                        // Optionally update the input value to the formatted address
                        if (place.formatted_address) {
                            setInputValue(place.formatted_address);
                        }
                    }
                }
            });
        }
    }
  }, [onPlaceSelected]);

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