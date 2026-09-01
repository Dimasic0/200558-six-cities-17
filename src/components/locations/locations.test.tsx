import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Locations, type TLocationsProps } from './locations';
import { cityDefault, СITIES } from '../../data/constant';
import { TCity } from '../../types/types';

const getActiveCity = (): string | null | undefined =>
  document.querySelector('.tabs__item--active span')?.textContent;

type TRenderLocationsProps = Partial<TLocationsProps>;

const renderLocations = ({
  onClick = vi.fn(),
  defaultActive = cityDefault,
  cities = СITIES,
  ...props
}: TRenderLocationsProps = {}) => ({
  onClick,
  ...render(
    <Locations cities={cities} onClick={onClick} defaultActive={defaultActive} {...props} />
  ),
});

describe('Locations', () => {
  it('renders cities in the correct order', () => {
    renderLocations();

    const cityNames = screen.getAllByRole('listitem').map((item) => item.textContent);

    expect(cityNames).toEqual([...СITIES]);
  });

  it('marks defaultActive as active when city is not provided', () => {
    renderLocations();

    expect(getActiveCity()).toBe(cityDefault);
  });

  it('marks city as active when city prop is provided', () => {
    const city: TCity = 'Amsterdam';

    renderLocations({ city });

    expect(getActiveCity()).toBe(city);
  });

  it('updates active city when city prop is passed after mount', () => {
    const city: TCity = 'Brussels';

    const { rerender, onClick } = renderLocations();

    expect(getActiveCity()).toBe(cityDefault);

    rerender(
      <Locations
        cities={СITIES}
        onClick={onClick}
        defaultActive={cityDefault}
        city={city}
      />
    );

    expect(getActiveCity()).toBe(city);
  });

  it('changes active city and calls onClick when a city is clicked', async () => {
    const user = userEvent.setup();
    const city: TCity = 'Hamburg';
    const { onClick } = renderLocations();

    await user.click(screen.getByText(city));

    expect(getActiveCity()).toBe(city);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(city);
  });
});
