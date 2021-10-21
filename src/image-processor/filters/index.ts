import BlurFilter from './blur-filter';
import ContrastFilter from './contrast-filter';
import CropFilter from './crop-filter';
import GrayscaleFilter from './grayscale-filter';
import OpacityFilter from './opacity-filter';
// import OverlayFilter from './overlay-filter';
import ResizeFilter from './resize-filter';
import SaturateFilter from './saturate-filter';
import RotateFilter from './rotate-filter';
import ColorReplacementFilter from './color-replacement-filter';

const SUPPORT_FILTERS = [
  ContrastFilter,
  ResizeFilter,
  GrayscaleFilter,
  OpacityFilter,
  SaturateFilter,
  BlurFilter,
  // OverlayFilter,
  CropFilter,
  RotateFilter,
  ColorReplacementFilter,
];

export default SUPPORT_FILTERS;
