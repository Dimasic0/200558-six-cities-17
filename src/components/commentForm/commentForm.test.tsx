import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CommentForm } from './commentForm';

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

describe('CommentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('checks the corresponding radio when a star is clicked', async () => {
    const user = userEvent.setup();
    renderCommentForm();

    expect(getRatingInput(2)).toBeChecked();

    await user.click(document.querySelector('label[for="4-stars"]')!);

    expect(getRatingInput(4)).toBeChecked();
    expect(getRatingInput(2)).not.toBeChecked();
  });

  it('disables submit button initially', () => {
    renderCommentForm();

    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
  });

  it('enables submit button when review text is at least 50 characters', async () => {
    const user = userEvent.setup();
    renderCommentForm();

    const submitButton = screen.getByRole('button', { name: 'Submit' });
    const textarea = screen.getByRole('textbox');

    expect(submitButton).toBeDisabled();

    await user.type(textarea, REVIEW_TEXT);

    expect(submitButton).not.toBeDisabled();
  });

  it('assigns textareaRef to the textarea element', () => {
    const textareaRef = createRef<HTMLTextAreaElement>();
    renderCommentForm(textareaRef);

    expect(textareaRef.current).toBe(screen.getByRole('textbox'));
    expect(textareaRef.current).toHaveAttribute('id', 'review');
  });

  it('calls onSubmit when submit button is clicked', async () => {
    const user = userEvent.setup();
    const { onSubmit } = renderCommentForm();

    await user.click(document.querySelector('label[for="5-stars"]')!);
    await user.type(screen.getByRole('textbox'), REVIEW_TEXT);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ comment: REVIEW_TEXT, rating: 5 });
  });
});
