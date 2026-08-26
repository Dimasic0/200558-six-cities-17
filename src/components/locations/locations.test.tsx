import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Locations } from './locations';
import { cityDefault, СITIES } from '../../data/constant';
import { TCity } from '../../types/types';

const getActiveCity = (): string | null | undefined =>
  document.querySelector('.tabs__item--active span')?.textContent;

describe('Locations', () => {
  const onClick = vi.fn();

  it('renders cities in the correct order', () => {
    render(<Locations cities={СITIES} onClick={onClick} defaultActive={cityDefault} />);

    const cityNames = screen.getAllByRole('listitem').map((item) => item.textContent);

    expect(cityNames).toEqual([...СITIES]);
  });

  it('marks defaultActive as active when city is not provided', () => {
    render(<Locations cities={СITIES} onClick={onClick} defaultActive={cityDefault} />);

    expect(getActiveCity()).toBe(cityDefault);
  });

  it('marks city as active when city prop is provided', () => {
    const city: TCity = 'Amsterdam';

    render(
      <Locations
        cities={СITIES}
        onClick={onClick}
        defaultActive={cityDefault}
        city={city}
      />
    );

    expect(getActiveCity()).toBe(city);
  });

  it('updates active city when city prop is passed after mount', () => {
    const city: TCity = 'Brussels';

    const { rerender } = render(
      <Locations cities={СITIES} onClick={onClick} defaultActive={cityDefault} />
    );

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

    render(<Locations cities={СITIES} onClick={onClick} defaultActive={cityDefault} />);

    await user.click(screen.getByText(city));

    expect(getActiveCity()).toBe(city);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(city);
  });
});
