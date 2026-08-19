import { type ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Map as LeafletMap } from 'leaflet';
import type { TLocation } from '../../types/types';
import {
  URL_MARKER_CURRENT,
  URL_MARKER_DEFAULT,
} from '../../data/constant';

const {
  defaultIcon,
  currentIcon,
  mockMap,
  MockIcon,
  MockMarker,
  mockLayerGroup,
  mockUseMap,
} = vi.hoisted(() => {
  const defaultIcon = { name: 'default-icon' };
  const currentIcon = { name: 'current-icon' };

  const mockMap = {
    removeLayer: ()=>{},
    addLayer : ()=>{},
  } as unknown as LeafletMap;

  const MockIcon = vi.fn(function Icon(
    this: { iconUrl: string },
    options: { iconUrl: string },
  ) {
    this.iconUrl = options.iconUrl;
    return options.iconUrl.includes('main-pin') ? currentIcon : defaultIcon;
  });

  const MockMarker = vi.fn(() => ({
    setIcon: function setIcon(){ return this; },
    addTo: ()=>{},
  }));

  const mockLayerGroup = vi.fn(() => ({
    addTo: ()=>{},
  }));

  const mockUseMap = vi.fn((): LeafletMap | undefined => mockMap);

  return {
    defaultIcon,
    currentIcon,
    mockMap,
    MockIcon,
    MockMarker,
    mockLayerGroup,
    mockUseMap,
  };
});

vi.mock('leaflet', () => ({
  Icon: MockIcon,
  Marker: MockMarker,
  layerGroup: mockLayerGroup,
}));

vi.mock('../../hooks/use-map/use-map', () => ({
  default: mockUseMap,
}));

import Map, { type point } from './map';

const city: TLocation = {
  latitude: 48.85661,
  longitude: 2.351499,
  zoom: 13,
};

const samplePoints: point[] = [
  {
    id: 'offer-1',
    location: {
      latitude: 48.86861,
      longitude: 2.342499,
      zoom: 16,
    },
  },
  {
    id: 'offer-2',
    location: {
      latitude: 48.85861,
      longitude: 2.330499,
      zoom: 16,
    },
  },
];

type TMapTestProps = Partial<ComponentProps<typeof Map>>;

const renderMap = (props: TMapTestProps = {}) => {
  const {
    city: cityProp = city,
    points = samplePoints,
    selectedPoint = null,
  } = props;

  return render(
    <Map city={cityProp} points={points} selectedPoint={selectedPoint} />,
  );
};

describe('Map', () => {
  beforeEach(() => {
    mockUseMap.mockReset();
    mockUseMap.mockReturnValue(mockMap);
    MockMarker.mockClear();
  });

  // Контейнер карты — единственный DOM-узел компонента
  it('renders full-height map container', () => {
    const { container } = renderMap();

    const mapContainer = container.firstElementChild as HTMLElement;
    expect(mapContainer.tagName).toBe('DIV');
    expect(mapContainer.style.height).toBe('100%');
  });

  // useMap получает ref на контейнер и координаты города
  it('passes map ref and city to useMap', () => {
    const { container } = renderMap({ city });

    expect(mockUseMap).toHaveBeenCalledTimes(1);
    expect(mockUseMap).toHaveBeenCalledWith(
      expect.objectContaining({ current: container.firstElementChild }),
      city,
    );
  });

  // Пока карта не инициализирована — маркеры не создаём
  it('does not create markers when map is not ready', () => {
    mockUseMap.mockReturnValue(undefined);

    renderMap();
    expect(MockMarker).not.toHaveBeenCalled();
  });

  // Пустой points — слой есть, маркеров нет
  it('creates marker layer without markers when points is empty', () => {
    renderMap({ points: [] });
    expect(MockMarker).not.toHaveBeenCalled();
  });

  // Для каждой точки — Marker с lat/lng из location
  it('creates a marker for each point at its location', () => {
    renderMap();

    expect(MockMarker).toHaveBeenCalledTimes(samplePoints.length);
    samplePoints.forEach(({ location }, index) => {
      expect(MockMarker).toHaveBeenNthCalledWith(index + 1, {
        lat: location.latitude,
        lng: location.longitude,
      });
    });
  });

  // Смена points/selectedPoint — cleanup старого слоя и новый набор маркеров
  it('replaces marker layer when points or selectedPoint change', () => {
    const { rerender } = renderMap({ selectedPoint: 'offer-1' });

    expect(MockMarker).toHaveBeenCalledTimes(2);

    rerender(
      <Map city={city} points={samplePoints} selectedPoint="offer-2" />,
    );
    expect(MockMarker).toHaveBeenCalledTimes(4);
  });

  // Icon создаётся с URL из констант проекта (модульный уровень map.tsx)
  it('creates leaflet icons with project marker URLs', () => {
    expect(MockIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        iconUrl: URL_MARKER_DEFAULT,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      }),
    );
    expect(MockIcon).toHaveBeenCalledWith(
      expect.objectContaining({
        iconUrl: URL_MARKER_CURRENT,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      }),
    );
  });
});
