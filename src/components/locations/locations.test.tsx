import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Locations } from './locations';
import { СITIES, cityDefault } from '../../data/constant';
import type { TCity } from '../../types/types';

type TLocationsTestProps = Partial<ComponentProps<typeof Locations>>;

const renderLocations = (props: TLocationsTestProps = {}) => {
  const {
    cities = СITIES,
    onClick = vi.fn(),
    city,
    defaultActive,
  } = props;

  return {
    onClick,
    ...render(
      <Locations
        cities={cities}
        onClick={onClick}
        city={city}
        defaultActive={defaultActive}
      />,
    ),
  };
};

/** Родительский div.locations__item-link у названия города */
const getCityLink = (name: TCity) => screen.getByText(name).closest('.locations__item-link');

describe('Locations', () => {
  // Список строится из props.cities — в разметке должны быть все названия
  it('renders all cities from cities prop', () => {
    renderLocations();

    СITIES.forEach((cityName) => {
      expect(screen.getByText(cityName)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(СITIES.length);
  });

  // Без city начальный active берётся из defaultActive
  it('marks defaultActive city as active on mount', () => {
    renderLocations({ defaultActive: cityDefault });

    expect(getCityLink(cityDefault)).toHaveClass('tabs__item--active');
    expect(getCityLink('Cologne')).not.toHaveClass('tabs__item--active');
  });

  // city || defaultActive → controlled city важнее defaultActive
  it('prefers city over defaultActive for initial active state', () => {
    renderLocations({ city: 'Amsterdam', defaultActive: 'Paris' });

    expect(getCityLink('Amsterdam')).toHaveClass('tabs__item--active');
    expect(getCityLink('Paris')).not.toHaveClass('tabs__item--active');
  });

  // Клик: локальный active + колбэк родителю с выбранным городом
  it('calls onClick and marks city active on click', async () => {
    const user = userEvent.setup();
    const { onClick } = renderLocations({ defaultActive: 'Paris' });

    await user.click(screen.getByText('Cologne'));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith('Cologne');
    expect(getCityLink('Cologne')).toHaveClass('tabs__item--active');
    expect(getCityLink('Paris')).not.toHaveClass('tabs__item--active');
  });

  // useEffect синхронизирует active, когда родитель меняет city
  it('updates active city when city prop changes', () => {
    const { rerender } = renderLocations({
      city: 'Paris',
      onClick: vi.fn(),
    });

    expect(getCityLink('Paris')).toHaveClass('tabs__item--active');

    rerender(
      <Locations cities={СITIES} onClick={vi.fn()} city="Hamburg" />,
    );

    expect(getCityLink('Hamburg')).toHaveClass('tabs__item--active');
    expect(getCityLink('Paris')).not.toHaveClass('tabs__item--active');
  });
});
