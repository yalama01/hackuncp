import React, { useState } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';

const AddressAutocomplete = ({ onSelect }) => {
  const [address, setAddress] = useState('');

  const { ref } = usePlacesWidget({
    apiKey: 'YOUR_API_KEY',
    onPlaceSelected: (place) => {
      setAddress(place.formatted_address);
      onSelect(place);
    },
    options: {
      types: ['address'],
      componentRestrictions: { country: 'us' },
    },
  });

  return (
    <input
      ref={ref}
      value={address}
      onChange={(e) => setAddress(e.target.value)}
      placeholder="Enter an address"
      style={{ width: '100%', padding: '8px' }}
    />
  );
};

export default AddressAutocomplete;
