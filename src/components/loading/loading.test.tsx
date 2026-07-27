import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Loading', () => {
  // Без props → fallback-текст «Loading»
  it('renders default text when text is not provided', () => {
    render(<Loading />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loading');
  });

  // Переданный text должен отобразиться как есть
  it('renders custom text when text prop is provided', () => {
    render(<Loading text="Please wait…" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Please wait…');
  });

  // Пустая строка — falsy, сработает fallback (text || 'Loading')
  it('falls back to default text when text is empty string', () => {
    render(<Loading text="" />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Loading');
  });
});
