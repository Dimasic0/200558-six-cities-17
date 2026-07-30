import { type ComponentProps } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OfferGallery, { type TOfferGalleryChildren } from './offerGallery';

const makeImage = (
  overrides: Partial<TOfferGalleryChildren> = {},
): TOfferGalleryChildren => ({
  id: '1',
  src: 'https://example.com/photo-1.jpg',
  alt: 'Photo 1',
  ...overrides,
});

const sampleImages = [
  makeImage({ id: '1', src: '/img/1.jpg', alt: 'Living room' }),
  makeImage({ id: '2', src: '/img/2.jpg', alt: 'Kitchen' }),
  makeImage({ id: '3', src: '/img/3.jpg', alt: 'Bedroom' }),
];

type TOfferGalleryTestProps = Partial<ComponentProps<typeof OfferGallery>>;

const renderOfferGallery = (props: TOfferGalleryTestProps = {}) => {
  const { children = sampleImages } = props;

  return render(<OfferGallery children={children} />);
};

describe('OfferGallery', () => {
  // Корневой контейнер галереи — всегда div.offer__gallery
  it('renders gallery container', () => {
    const { container } = renderOfferGallery();

    expect(container.querySelector('.offer__gallery')).toBeInTheDocument();
  });

  // Пустой children — галерея без картинок и обёрток
  it('renders no images when children is empty', () => {
    const { container } = renderOfferGallery({ children: [] });

    expect(screen.queryAllByRole('img')).toHaveLength(0);
    expect(container.querySelectorAll('.offer__image-wrapper')).toHaveLength(0);
  });

  // На каждый элемент массива — одна обёртка и одно изображение
  it('renders an image wrapper for each child', () => {
    const { container } = renderOfferGallery();

    expect(container.querySelectorAll('.offer__image-wrapper')).toHaveLength(
      sampleImages.length,
    );
    expect(screen.getAllByRole('img')).toHaveLength(sampleImages.length);
  });

  // src и alt берутся из данных элемента, класс картинки — offer__image
  it('passes src and alt from each child to the corresponding img', () => {
    renderOfferGallery();

    const images = screen.getAllByRole('img');

    sampleImages.forEach((item, index) => {
      expect(images[index]).toHaveAttribute('src', item.src);
      expect(images[index]).toHaveAttribute('alt', item.alt);
      expect(images[index]).toHaveClass('offer__image');
    });
  });
});
