import ContrastFilter from './ContrastFilter';
import ResizeFilter from './ResizeFilter';
import GrayscaleFilter from './GrayscaleFilter';
import OpacityFilter from './OpacityFilter';
import SaturateFilter from './SaturateFilter';
import BlurFilter from './BlurFilter';
import OverlayFilter from './OverlayFilter';
import CropFilter from './CropFilter';

const SUPPORT_FILTERS = [
  ContrastFilter,
  ResizeFilter,
  GrayscaleFilter,
  OpacityFilter,
  SaturateFilter,
  BlurFilter,
  OverlayFilter,
  CropFilter,
];

export default SUPPORT_FILTERS;
