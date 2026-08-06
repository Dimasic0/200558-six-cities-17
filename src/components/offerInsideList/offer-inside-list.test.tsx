import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OfferInsideList from './offer-inside-list';

// Фикстура списка удобств — переиспользуется в нескольких кейсах
const sampleList = ['Wi-Fi', 'Heating', 'Kitchen', 'Cable TV'];

type TOfferInsideListTestProps = Partial<ComponentProps<typeof OfferInsideList>>;

// Общий рендер: дефолтный list, чтобы в тестах не дублировать JSX и props
const renderOfferInsideList = (props: TOfferInsideListTestProps = {}) => {
  const { list = sampleList } = props;

  return render(<OfferInsideList list={list} />);
};

describe('OfferInsideList', () => {
  // Корневой контейнер — всегда ul.offer__inside-list
  it('renders inside list container', () => {
    renderOfferInsideList();

    expect(screen.getByRole('list')).toHaveClass('offer__inside-list');
  });

  // Пустой list — список без пунктов
  it('renders no items when list is empty', () => {
    renderOfferInsideList({ list: [] });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  // На каждый элемент массива — один li.offer__inside-item
  it('renders a list item for each entry', () => {
    const { container } = renderOfferInsideList();

    expect(screen.getAllByRole('listitem')).toHaveLength(sampleList.length);
    expect(container.querySelectorAll('.offer__inside-item')).toHaveLength(
      sampleList.length,
    );
  });

  // Текст пункта берётся из строки массива as-is
  it('renders each list entry as list item text', () => {
    renderOfferInsideList();

    const items = screen.getAllByRole('listitem');

    sampleList.forEach((entry, index) => {
      expect(items[index]).toHaveTextContent(entry);
    });
  });
});
