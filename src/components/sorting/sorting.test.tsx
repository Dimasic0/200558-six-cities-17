import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sortingName } from '../../data/constant';
import { FormSorting } from './sorting';

const SORTING_OPTIONS = [
  sortingName.popular,
  sortingName.low,
  sortingName.high,
  sortingName.rated,
] as const;

const getSortingType = (): HTMLElement | null =>
  document.querySelector('.places__sorting-type');

const getOptionByText = (text: string): HTMLElement =>
  Array.from(document.querySelectorAll('.places__option')).find(
    (option) => option.textContent === text
  ) as HTMLElement;

const getActiveOption = (): HTMLElement | undefined =>
  Array.from(document.querySelectorAll('.places__option')).find((option) =>
    (option as HTMLElement).style.backgroundColor === 'blue'
  ) as HTMLElement | undefined;

describe('FormSorting', () => {
  const onClick = vi.fn();

  beforeEach(() => {
    onClick.mockClear();
  });

  it('displays active sorting option in places__sorting-type', () => {
    render(<FormSorting onClick={onClick} />);

    expect(getSortingType()).toHaveTextContent(sortingName.popular);
  });

  it('does not render options list before sorting type is clicked', () => {
    render(<FormSorting onClick={onClick} />);

    expect(document.querySelector('.places__options')).not.toBeInTheDocument();
    expect(document.querySelectorAll('.places__option')).toHaveLength(0);
  });

  it('renders options list when sorting type is clicked', async () => {
    const user = userEvent.setup();

    render(<FormSorting onClick={onClick} />);

    await user.click(getSortingType()!);

    expect(document.querySelector('.places__options')).toBeInTheDocument();
    expect(document.querySelectorAll('.places__option')).toHaveLength(SORTING_OPTIONS.length);
  });

  it('marks default sorting option as active in the list', async () => {
    const user = userEvent.setup();

    render(<FormSorting onClick={onClick} />);

    await user.click(getSortingType()!);

    expect(getActiveOption()).toHaveTextContent(sortingName.popular);
  });

  it.each(SORTING_OPTIONS)(
    'updates sorting type text and active option when %s is selected',
    async (option) => {
      const user = userEvent.setup();

      render(<FormSorting onClick={onClick} />);

      await user.click(getSortingType()!);
      await user.click(getOptionByText(option));

      expect(getSortingType()).toHaveTextContent(option);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(option);
      expect(document.querySelector('.places__options')).not.toBeInTheDocument();

      await user.click(getSortingType()!);

      expect(getActiveOption()).toHaveTextContent(option);
    }
  );
});
