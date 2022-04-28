import { useState } from 'react';

interface Props {
  lyrics: string;
  title: string;
  close: () => void;
}
export const LyricsModal = ({ lyrics, title, close }: Props) => {
  return (
    <>
      <input
        type="checkbox"
        id="my-modal-6"
        className="modal-toggle"
        checked
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Lyrics for {title}</h3>
          <p className="py-4">{lyrics}</p>
          <div className="modal-action">
            <button onClick={close} className="btn w-full">
              Close Lyrics
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
