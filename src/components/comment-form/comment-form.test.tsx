import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommentForm } from './comment-form';

const REVIEW_TEXT = 'a'.repeat(50);

function getRatingInput(stars: number): HTMLInputElement {
  const input = document.getElementById(`${stars}-stars`);
  return input as HTMLInputElement;
}

function renderCommentForm(textareaRef = createRef<HTMLTextAreaElement>()) {
  const onSubmit = vi.fn();

  render(<CommentForm onSubmit={onSubmit} textareaRef={textareaRef} />);

  return { onSubmit, textareaRef };
}

const getButtonSubmit = () => screen.getByRole('button', { name: 'Submit' });
const getTextarea = () => screen.getByRole('textbox');

describe('CommentForm', () => {
  it('checks the corresponding radio when a star is clicked', async () => {
    const user = userEvent.setup();
    renderCommentForm();

    expect(getRatingInput(2)).toBeChecked();
    for (let i = 1; i <= 5; i++) {
      await user.click(document.querySelector(`label[for="${i}-stars"]`)!);
      expect(getRatingInput(i)).toBeChecked();
      const previousRating = i>1 ? i-1 : 2;
      expect(getRatingInput(previousRating)).not.toBeChecked();
    }
  });

  it('disables submit button initially', () => {
    renderCommentForm();

    expect(getButtonSubmit()).toBeDisabled();
  });

  it('enables submit button when review text is at least 50 characters', async () => {
    const user = userEvent.setup();
    renderCommentForm();

    const submitButton = getButtonSubmit();
    const textarea = getTextarea();

    expect(submitButton).toBeDisabled();
    const REVIEW_TEXT_THRESHOLD = 'a'.repeat(49);
    await user.type(textarea, REVIEW_TEXT_THRESHOLD);
    expect(submitButton).toBeDisabled();
    await user.type(textarea, 'a');
    expect(submitButton).not.toBeDisabled();
  });

  it('assigns textareaRef to the textarea element', () => {
    const textareaRef = createRef<HTMLTextAreaElement>();
    renderCommentForm(textareaRef);

    expect(textareaRef.current).toBe(getTextarea());
    expect(textareaRef.current).toHaveAttribute('id', 'review');
  });

  it('calls onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderCommentForm();

    await user.click(document.querySelector('label[for="5-stars"]')!);
    await user.type(getTextarea(), REVIEW_TEXT);
    await user.click(getButtonSubmit());

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ comment: REVIEW_TEXT, rating: 5 });
  });
});
