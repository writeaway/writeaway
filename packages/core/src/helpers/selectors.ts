import { GetIWriteAwayState } from 'types';

export const selectWA = (getter: GetIWriteAwayState) => getter()['@writeaway'];

export const selectPieces = (getter: GetIWriteAwayState) => selectWA(getter).pieces;

export const selectConfig = (getter: GetIWriteAwayState) => selectWA(getter).config;

export const selectGlobal = (getter: GetIWriteAwayState) => selectWA(getter).global;
