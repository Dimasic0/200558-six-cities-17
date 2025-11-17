import {useEffect, useState, MutableRefObject, useRef} from 'react';
import {Map, TileLayer} from 'leaflet';
import { TLocation } from '../types/types';

function useMap(
  mapRef: MutableRefObject<HTMLElement | undefined>,
  city: TLocation
): Map | undefined {
  const [map, setMap] = useState<Map | undefined>(undefined);
  const isRenderedRef = useRef<boolean>(false);

  useEffect(() => {
    if (mapRef.current !== undefined && !isRenderedRef.current) {
      const instance = new Map(mapRef.current, {
        center: {
          lat: city.latitude,
          lng: city.longitude
        },
        zoom: 13
      });

      const layer = new TileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        }
      );

      instance.addLayer(layer);

      setMap(instance);
      isRenderedRef.current = true;
    }
  }, [mapRef, city ]);
  useEffect(()=>{
    if(map) {
      map.setView([city.latitude, city.longitude]);
    }
  }, [ city, map]);

  return map;
}

export default useMap;
