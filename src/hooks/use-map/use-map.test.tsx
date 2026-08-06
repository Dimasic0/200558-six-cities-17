import { createRef, type MutableRefObject } from 'react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { TLocation } from '../../types/types';

const {
  mockSetView,
  mockMapInstance,
  MockMap,
} = vi.hoisted(() => {
  const mockSetView = vi.fn();
  const mockMapInstance = {
    setView: mockSetView,
  };

  const MockMap = vi.fn(function Map() {
    return mockMapInstance;
  });

  return {
    mockSetView,
    mockMapInstance,
    MockMap
  };
});

vi.mock('leaflet', () => ({
  Map: MockMap,
}));

import useMap from './use-map';

const city: TLocation = {
  latitude: 48.85661,
  longitude: 2.351499,
  zoom: 13,
};

const anotherCity: TLocation = {
  latitude: 50.938361,
  longitude: 6.959974,
  zoom: 13,
};

const createMapRef = (
  element: HTMLElement | null = document.createElement('div'),
): MutableRefObject<HTMLElement | null> => {
  const mapRef = createRef<HTMLElement>();
  (mapRef as MutableRefObject<HTMLElement | null>).current = element;
  return mapRef as MutableRefObject<HTMLElement | null>;
};

describe('useMap', () => {
  beforeEach(() => {
    MockMap.mockClear();
    mockSetView.mockClear();
  });

  // Без DOM-контейнера карту создавать нельзя
  it('returns undefined when mapRef.current is null', () => {
    const mapRef = createMapRef(null);

    const { result } = renderHook(() => useMap(mapRef, city));

    expect(result.current).toBeUndefined();
    expect(MockMap).not.toHaveBeenCalled();
  });

  // Первый рендер с контейнером — создаём Map и тайловый слой
  it('creates leaflet map and tile layer when container is ready', () => {
    const container = document.createElement('div');
    const mapRef = createMapRef(container);

    const { result } = renderHook(() => useMap(mapRef, city));

    expect(MockMap).toHaveBeenCalledTimes(1);
    expect(MockMap).toHaveBeenCalledWith(container, {
      center: {
        lat: city.latitude,
        lng: city.longitude,
      },
      zoom: 13,
    });
    expect(result.current).toBe(mockMapInstance);
  });

  // isRenderedRef не даёт создать вторую карту при повторных effect
  it('initializes map only once even when city changes', () => {
    const mapRef = createMapRef();

    const { rerender } = renderHook(
      ({ city: nextCity }) => useMap(mapRef, nextCity),
      { initialProps: { city } },
    );

    expect(MockMap).toHaveBeenCalledTimes(1);

    rerender({ city: anotherCity });

    expect(MockMap).toHaveBeenCalledTimes(1);
  });

  // Смена города двигает уже созданную карту через setView
  it('calls setView when city changes after map is ready', () => {
    const mapRef = createMapRef();

    const { rerender } = renderHook(
      ({ city: nextCity }) => useMap(mapRef, nextCity),
      { initialProps: { city } },
    );

    // Первый setView — сразу после появления map в state
    expect(mockSetView).toHaveBeenCalledWith([city.latitude, city.longitude]);

    rerender({ city: anotherCity });

    expect(mockSetView).toHaveBeenCalledWith([
      anotherCity.latitude,
      anotherCity.longitude,
    ]);
  });
});
