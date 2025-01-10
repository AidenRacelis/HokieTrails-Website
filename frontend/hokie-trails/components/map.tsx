/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";

import AutocompleteInput from './search-bar';
import React from "react";


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
const defaultMapZoom = 10

//Map options
const defaultMapOptions = {
    zoomControl: true,
    tilt: 0,
    gestureHandling: 'auto',
    
};




const MapComponent: React.FC = () => {

    const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
        // Handle the selected place details
        console.log(place);
      };

    return (
        <div className="box">
            <h1 className="title">Let's Go Hiking!</h1>

            <AutocompleteInput onPlaceSelected={handlePlaceSelected} >
            </AutocompleteInput>
            

            <div className="w-full">
                <GoogleMap 
                mapContainerStyle={defaultMapContainerStyle}
                center = {defaultMapCenter}
                zoom= {defaultMapZoom}
                options={defaultMapOptions}
                >
                    <Marker
                    position = {defaultMapCenter}
                    ></Marker>
                </GoogleMap>
            </div>
        </div>
        
            


        
    )
};

export { MapComponent };