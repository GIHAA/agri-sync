import React, { useState, useEffect, useRef } from 'react';
import { Map as MapIcon } from 'lucide-react';

const MapPicker = ({ onLocationSelect, initialLat = 0, initialLng = 0 }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat || 20.5937,
    lng: initialLng || 78.9629
  });
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const leafletRef = useRef(null);

  useEffect(() => {
    if (showMap && !leafletRef.current) {
      // Load Leaflet CSS
      const linkElement = document.createElement('link');
      linkElement.rel = 'stylesheet';
      linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      document.head.appendChild(linkElement);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      script.onload = initializeMap;
      document.head.appendChild(script);
    }
  }, [showMap]);

  const initializeMap = () => {
    if (!mapRef.current || leafletRef.current) return;

    const L = window.L;
    leafletRef.current = L;

    // Initialize map
    const map = L.map(mapRef.current).setView([selectedLocation.lat, selectedLocation.lng], 5);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker
    markerRef.current = L.marker([selectedLocation.lat, selectedLocation.lng], {
      draggable: true
    }).addTo(map);

    // Handle map clicks
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      markerRef.current.setLatLng([lat, lng]);
      setSelectedLocation({ lat, lng });
      onLocationSelect(lat, lng);
    });

    // Handle marker drag
    markerRef.current.on('dragend', () => {
      const position = markerRef.current.getLatLng();
      setSelectedLocation({ lat: position.lat, lng: position.lng });
      onLocationSelect(position.lat, position.lng);
    });
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="h-5 w-5" />
          <span className="font-medium">Location Picker</span>
        </div>
        <button
          type="button"
          onClick={() => setShowMap(!showMap)}
          className="rounded bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {showMap && (
        <div className="mb-4 rounded-lg border border-gray-200 p-4">
          <div 
            ref={mapRef}
            className="h-64 w-full rounded"
            style={{ minHeight: '256px' }}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-600">Latitude</span>
          <input
            type="text"
            value={selectedLocation.lat.toFixed(6)}
            className="rounded border border-gray-200 p-2"
            readOnly
          />
        </div>
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-600">Longitude</span>
          <input
            type="text"
            value={selectedLocation.lng.toFixed(6)}
            className="rounded border border-gray-200 p-2"
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default MapPicker;