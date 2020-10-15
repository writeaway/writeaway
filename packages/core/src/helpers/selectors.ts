import { GetIWriteAwayState } from 'types';
import { REDUCER_KEY } from '../constants';

export const selectWA = (getter: GetIWriteAwayState) => getter()[REDUCER_KEY];

export const selectPieces = (getter: GetIWriteAwayState) => selectWA(getter).pieces;

export const selectConfig = (getter: GetIWriteAwayState) => selectWA(getter).config;

export const selectGlobal = (getter: GetIWriteAwayState) => selectWA(getter).global;
