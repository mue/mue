import React from "react";
import { MdOutlineArrowForwardIos, MdOutlineArrowBackIos } from 'react-icons/md';

export const PrevButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--prev"
    onClick={onClick}
    disabled={!enabled}
  >
    <MdOutlineArrowBackIos/>
  </button>
);

export const NextButton = ({ enabled, onClick }) => (
  <button
    className="embla__button embla__button--next"
    onClick={onClick}
    disabled={!enabled}
  >
    <MdOutlineArrowForwardIos/>
  </button>
);
