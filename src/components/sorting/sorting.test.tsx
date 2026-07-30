import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FormSorting } from './sorting';
import { sortingName } from '../../data/constant';
import type { TSortingName } from '../../data/constant';

type TFormSortingTestProps = Partial<ComponentProps<typeof FormSorting>>;

/** Все варианты сортировки из enum — тот же порядок, что в компоненте */
const SORTING_OPTIONS: TSortingName[] = [
  sortingName.popular,
  sortingName.low,
  sortingName.high,
  sortingName.rated,
];

/**
 * Рендер FormSorting с дефолтным onClick-моком.
 * В кейсе передавай только то, что отличается от дефолта.
 */
const renderFormSorting = (props: TFormSortingTestProps = {}) => {
  const { onClick = vi.fn() } = props;

  return {
    onClick,
    ...render(<FormSorting onClick={onClick} />),
  };
};

/** Кликабельный заголовок текущего типа сортировки (.places__sorting-type) */
const getSortingTrigger = () =>
  document.querySelector('.places__sorting-type') as HTMLElement;

const getOptionsList = () =>
  document.querySelector('.places__options--opened');

const getOption = (name: TSortingName) =>
  screen.getByText(name, { selector: '.places__option' });

describe('FormSorting', () => {
  // На маунте active = 'Popular', список закрыт (isDisclosed = false)
  it('shows Popular as current type and hides options by default', () => {
    renderFormSorting();

    expect(getSortingTrigger()).toHaveTextContent(sortingName.popular);
    expect(getOptionsList()).not.toBeInTheDocument();
  });

  // Клик по .places__sorting-type переключает isDisclosed → true
  it('opens options list on sorting type click', async () => {
    const user = userEvent.setup();
    renderFormSorting();

    await user.click(getSortingTrigger());

    expect(getOptionsList()).toBeInTheDocument();
    SORTING_OPTIONS.forEach((option) => {
      expect(getOption(option)).toBeInTheDocument();
    });
    expect(screen.getAllByRole('listitem')).toHaveLength(SORTING_OPTIONS.length);
  });

  // Повторный клик по триггеру: !isDisclosed → список снова скрыт
  it('closes options list on second sorting type click', async () => {
    const user = userEvent.setup();
    renderFormSorting();

    await user.click(getSortingTrigger());
    expect(getOptionsList()).toBeInTheDocument();

    await user.click(getSortingTrigger());
    expect(getOptionsList()).not.toBeInTheDocument();
  });

  // Активный пункт подсвечивается inline-стилем backgroundColor: 'blue'
  // Проверяем через .style: toHaveStyle в jsdom нестабилен для именованных цветов
  it('highlights active option with blue background', async () => {
    const user = userEvent.setup();
    renderFormSorting();

    await user.click(getSortingTrigger());

    expect(getOption(sortingName.popular).style.backgroundColor).toBe('blue');
    expect(getOption(sortingName.low).style.backgroundColor).toBe('');
  });

  // onLiClick: setActive + закрытие списка + колбэк родителю
  it('calls onClick, updates active type and closes list when option is chosen', async () => {
    const user = userEvent.setup();
    const { onClick } = renderFormSorting();

    await user.click(getSortingTrigger());
    await user.click(getOption(sortingName.low));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(sortingName.low);
    expect(getSortingTrigger()).toHaveTextContent(sortingName.low);
    expect(getOptionsList()).not.toBeInTheDocument();
  });

  // После смены active новый пункт получает подсветку при повторном открытии
  it('highlights newly selected option after reopen', async () => {
    const user = userEvent.setup();
    renderFormSorting();

    await user.click(getSortingTrigger());
    await user.click(getOption(sortingName.rated));

    await user.click(getSortingTrigger());

    expect(getOption(sortingName.rated).style.backgroundColor).toBe('blue');
    expect(getOption(sortingName.popular).style.backgroundColor).toBe('');
  });
});
