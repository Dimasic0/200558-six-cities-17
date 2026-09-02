import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OfferInsideList from './offer-inside-list';

describe('OfferInsideList', () => {
  const list = ['Wi-Fi', 'Heating', 'Kitchen', 'Washing machine'];

  // Корневой ul с BEM-классом списка удобств
  it('renders ul with offer__inside-list class', () => {
    const { container } = render(<OfferInsideList list={list} />);

    expect(container.querySelector('.offer__inside-list')).toBeInTheDocument();
  });

  // По одному li на каждый элемент list
  it.each<[string, string[]]>([
    ['one item', [list[0]]],
    ['four items', list],
  ])('renders li for each list item when data has %s', (_, items) => {
    const { container } = render(<OfferInsideList list={items} />);

    const listItems = container.querySelectorAll('.offer__inside-item');

    expect(listItems).toHaveLength(items.length);
  });

  // Текст каждого удобства виден в DOM
  it('renders text content for each list item', () => {
    render(<OfferInsideList list={list} />);

    list.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  // Порядок li совпадает с порядком в list
  it('renders list items in the same order as list prop', () => {
    const { container } = render(<OfferInsideList list={list} />);

    const listItems = container.querySelectorAll('.offer__inside-item');

    listItems.forEach((item, index) => {
      expect(item).toHaveTextContent(list[index]);
    });
  });

  // Пустой list — ul без дочерних li
  it('renders empty list without list items', () => {
    const { container } = render(<OfferInsideList list={[]} />);

    expect(container.querySelector('.offer__inside-list')).toBeInTheDocument();
    expect(container.querySelectorAll('.offer__inside-item')).toHaveLength(0);
  });
});
