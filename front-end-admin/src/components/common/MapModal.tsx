"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import { Button } from "@/components/ui/button";
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

function LocationSelector({ onSelect }: { onSelect: (location: { lat: number; lng: number }) => void }) {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onSelect({ lat, lng });
        },
    });
    return null;
}

interface MapModalProps {
    onClose: () => void;
    onSelect: (location: { lat: number; lng: number }) => void;
    currentLat: number;
    currentLong: number;
}

export default function MapModal({ onClose, onSelect, currentLat, currentLong }: MapModalProps) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded shadow-lg p-6">
                <MapContainer
                    center={[7.8731, 80.7718]}
                    zoom={7}
                    style={{ height: '500px', width: '500px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationSelector onSelect={onSelect} />
                    {currentLat && currentLong && (
                        <Marker position={[currentLat, currentLong]} />
                    )}
                </MapContainer>
                <button
                    onClick={onClose}
                    className="mt-4 w-full"
                >
                    Close Map
                </button>
            </div>
        </div>
    );
}