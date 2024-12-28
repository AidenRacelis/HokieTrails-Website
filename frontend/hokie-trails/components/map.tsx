/* 
Since the map was loaded on client side, 
we need to make this component client rendered as well else error occurs
*/
'use client'

//Map component Component from library
import { GoogleMap, Marker } from "@react-google-maps/api";

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

const MapComponent = () => {
    return (
        <div className="w-full" 
        style={{
            position: 'fixed',
            bottom: '20px',
            right: '-3%',
            width: '95%',
            height: '80vh',
            borderRadius: '15px',
            overflow: 'hidden',
            zIndex: 10}}>

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
    )
};

export { MapComponent };