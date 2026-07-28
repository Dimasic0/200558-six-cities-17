import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CommentForm } from './commentForm';

const renderCommentForm = () => {
  const onSubmit = vi.fn();
  const textareaRef = createRef<HTMLTextAreaElement>();

  render(<CommentForm onSubmit={onSubmit} textareaRef={textareaRef} />);

  const textarea = screen.getByRole('textbox', { name: 'Your review' });
  const submitButton = screen.getByRole('button', { name: 'Submit' });

  return { onSubmit, textareaRef, textarea, submitButton };
};

describe('CommentForm', () => {
  // На старте текст пустой, поэтому кнопка отправки неактивна
  it('renders submit button disabled initially', () => {
    const { submitButton } = renderCommentForm();

    expect(submitButton).toBeDisabled();
  });

  // После 50+ символов текст проходит валидацию и кнопка становится активной
  it('enables submit button when comment has at least 50 characters', async () => {
    const user = userEvent.setup();
    const { textarea, submitButton } = renderCommentForm();

    await user.type(textarea, 'a'.repeat(50));

    expect(submitButton).toBeEnabled();
  });

  // submit передаёт введённый текст и выбранный рейтинг (по умолчанию рейтинг = 2)
  it('calls onSubmit with entered comment and default rating', async () => {
    const user = userEvent.setup();
    const { textarea, submitButton, onSubmit } = renderCommentForm();
    const commentText = 'Very nice place with clean rooms and helpful staff.';

    await user.type(textarea, commentText);
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({
      comment: commentText,
      rating: 2,
    });
  });

  // При выборе другой звезды форма должна отправить обновлённый рейтинг
  it('calls onSubmit with selected rating', async () => {
    const user = userEvent.setup();
    const { textarea, submitButton, onSubmit } = renderCommentForm();
    const commentText = 'Great location, smooth check-in and excellent host support.';

    await user.click(screen.getByDisplayValue('4'));
    await user.type(textarea, commentText);
    await user.click(submitButton);

    expect(onSubmit).toHaveBeenCalledWith({
      comment: commentText,
      rating: 4,
    });
  });

  // ref из props должен быть привязан к textarea
  it('attaches textarea element to provided ref', () => {
    const { textareaRef, textarea } = renderCommentForm();

    expect(textareaRef.current).toBe(textarea);
  });
});
