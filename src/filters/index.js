import ContrastFilter from "./ContrastFilter";
import ResizeFilter from "./ResizeFilter";
import ConvertFilter from "./ConvertFilter";
import GrayscaleFilter from "./GrayscaleFilter";
import OpacityFilter from "./OpacityFilter";
import SaturateFilter from "./SaturateFilter";
import BlurFilter from "./BlurFilter";
import OverlayFilter from "./OverlayFilter";

const SUPPORT_FILTERS = [
  ContrastFilter,
  ResizeFilter,
  ConvertFilter,
  GrayscaleFilter,
  OpacityFilter,
  SaturateFilter,
  BlurFilter,
  OverlayFilter,
];

export default SUPPORT_FILTERS;
