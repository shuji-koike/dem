type overscrollBehavior =
  | "auto"
  | "contain"
  | "none"
  | "inherit"
  | "initial"
  | "unset";
interface CSSStyleDeclaration {
  overscrollBehavior: overscrollBehavior;
  overscrollBehaviorX: overscrollBehavior;
  overscrollBehaviorY: overscrollBehavior;
}
