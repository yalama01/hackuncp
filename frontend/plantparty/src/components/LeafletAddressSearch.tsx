// LeafletAddressSearch.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

interface LeafletAddressSearchProps {
  onLocationSelected: (result: {
    label: string;
    x: number;
    y: number;
    bounds: [[number, number], [number, number]] | null;
    raw: any;
  }) => void;
}

const LeafletAddressSearch = ({ onLocationSelected }: LeafletAddressSearchProps) => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();

    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',       // how the search bar appears
      showMarker: true,   // show a marker on the map
      showPopup: false,   // show a popup with address info
      autoClose: true,    // close the search bar on result
      retainZoomLevel: false,
      animateZoom: true,
      keepResult: true
    });

    // Add the control to the map
    map.addControl(searchControl);

    // Listen for the "geosearch/showlocation" event, 
    // which is fired when a user selects a location
    map.on('geosearch/showlocation', (e: any) => {
      onLocationSelected(e.location);
    });

    // Cleanup on unmount
    return () => {
      map.removeControl(searchControl);
    };
  }, [map, onLocationSelected]);

  return null;
};

export default LeafletAddressSearch;
