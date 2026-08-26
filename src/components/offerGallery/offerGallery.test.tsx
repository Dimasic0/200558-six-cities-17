import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import OfferGallery, { TOfferGalleryChildren } from './offerGallery';

describe('OfferGallery', () => {
  const images: TOfferGalleryChildren[] = [
    { id: 'photo-1', src: 'photo-1.jpg', alt: 'First photo' },
    { id: 'photo-2', src: 'photo-2.jpg', alt: 'Second photo' },
    { id: 'photo-3', src: 'photo-3.jpg', alt: 'Third photo' },
  ];

  it('renders a wrapper div for each image item', () => {
    const { container } = render(<OfferGallery children={images} />);

    const wrappers = container.querySelectorAll('.offer__image-wrapper');

    expect(wrappers).toHaveLength(images.length);
  });

  it('renders img elements with corresponding src, alt and className', () => {
    render(<OfferGallery children={images} />);

    images.forEach(({ src, alt }) => {
      const img = screen.getByRole('img', { name: alt });

      expect(img).toHaveAttribute('src', src);
    });
  });

  it('renders wrappers and images in the same order as children (keyed by id)', () => {
    const { container } = render(<OfferGallery children={images} />);

    const wrappers = container.querySelectorAll('.offer__image-wrapper');

    wrappers.forEach((wrapper, index) => {
      const { src, alt } = images[index];
      const img = wrapper.querySelector('img');

      expect(img).toHaveAttribute('src', src);
      expect(img).toHaveAttribute('alt', alt);
      expect(img).toHaveClass('offer__image');
    });
  });
});
