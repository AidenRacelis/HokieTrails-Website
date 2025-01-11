/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";

import AutocompleteInput from './search-bar';
import React, { useState, useRef } from "react";


//Map's styling
const defaultMapContainerStyle = {
    width: '95%',
    height: '80vh',
    borderRadius: '15px 15px 15px 15px',
};

//K2's coordinates, currently set at Yosemite
const defaultMapCenter = {
    lat: 37.87453323411205,
    lng: -119.5383
}

//Default zoom level, can be adjusted
const defaultMapZoom = 15

//Map options
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    
};




const MapComponent: React.FC = () => {

    // Add state to track the current map center
    const [mapCenter, setMapCenter] = useState(defaultMapCenter);
    // Add state to track the marker position
    const [markerPosition, setMarkerPosition] = useState(defaultMapCenter);

      // Add ref for map instance
      const mapRef = useRef<google.maps.Map | null>(null);

      // Handle map load
      const onMapLoad = (map: google.maps.Map) => {
          mapRef.current = map;
      };

    const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
        if (place.geometry && place.geometry.location) {
            const newLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };
            
            // Update both map center and marker position
            setMapCenter(newLocation);
            setMarkerPosition(newLocation);

             // If we have a map instance, pan to the new location
             if (mapRef.current) {
                mapRef.current.panTo(newLocation);
            }
            
            console.log('Selected location:', newLocation);
        }
    };

    return (
        <div className="box">
            <h1 className="title">Let's Go Hiking!</h1>

            <AutocompleteInput onPlaceSelected={handlePlaceSelected} >
            </AutocompleteInput>
            

            <div className="w-full">
                <GoogleMap 
                mapContainerStyle={defaultMapContainerStyle}
                center = {mapCenter}
                zoom= {defaultMapZoom}
                options={defaultMapOptions}
                >
                    <Marker
                    position = {markerPosition}
                    ></Marker>
                </GoogleMap>
            </div>
        </div>
        
            


        
    )
};

export { MapComponent };