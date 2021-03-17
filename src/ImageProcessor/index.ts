import FilterFactory from './FilterFactory';
// eslint-disable-next-line node/no-unpublished-import
import SUPPORT_FILTERS from './filters';
import FilterProcessor from './FilterProcessor';
import {ImageBuilder} from './ImageBuilder';
import FilterInterface from './FilterInterface';

export type FilterConstructor = {
  new (): FilterInterface;
};

export type FilterMap = {
  name: string;
};

export enum SupportExtensions {
  jpg = 'jpg',
  gif = 'gif',
  webp = 'webp',
  png = 'png',
}

export enum SupportMimesTypes {
  jpg = 'image/jpeg',
  gif = 'image/gif',
  webp = 'image/webp',
  png = 'image/png',
}

export const supportTypes = new Map<SupportMimesTypes, SupportExtensions>([
  [SupportMimesTypes.jpg, SupportExtensions.jpg],
  [SupportMimesTypes.gif, SupportExtensions.gif],
  [SupportMimesTypes.webp, SupportExtensions.webp],
  [SupportMimesTypes.png, SupportExtensions.png],
]);

export {FilterFactory};
export {SUPPORT_FILTERS};
export {FilterInterface};
export {FilterProcessor};
export {ImageBuilder};
