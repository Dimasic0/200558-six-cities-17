import react, { Fragment, useState } from 'react';

type TCommentForm = { onSubmit: (evt: string) => void };

function CommentForm({ onSubmit }: TCommentForm): JSX.Element {
  const [text, setText] = useState<string>('');
  const [rating, setRating] = useState<number>(2);

  const onInput = (evt: react.ChangeEvent<HTMLTextAreaElement>): void => {
    setText(evt.target.value);
  };
  function onFormSubmit(evt: react.FormEvent<HTMLFormElement>) {
    onSubmit(text);
    evt.preventDefault();
  }
  function onInputChange(rat: number) {
    setRating(rat);
  }
  const inputRatings = Array.from({ length: 5 }, (el, i) => (
    <Fragment key={i}>
      <input
        className="form__rating-input visually-hidden"
        name="rating"
        checked={5 - i === rating}
        defaultValue={5 - i}
        id={`${5 - i}-stars`}
        type="radio"
        onChange={() => onInputChange(5 - i)}
      />
      <label
        htmlFor={`${5 - i}-stars`}
        className="reviews__rating-label form__rating-label"
        title="perfect"
      >
        <svg className="form__star-image" width={37} height={33}>
          <use xlinkHref="#icon-star"/>
        </svg>
      </label>
    </Fragment>
  ));

  return (
    <form className="reviews__form form" action="#" method="post" onSubmit={onFormSubmit} key="from">
      <label className="reviews__label form__label" htmlFor="review">
        Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {inputRatings}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        defaultValue={''}
        onInput={onInput}
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay with
          at least <b className="reviews__text-amount" key="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
export default CommentForm;
