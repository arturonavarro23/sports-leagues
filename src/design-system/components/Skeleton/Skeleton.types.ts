export type SkeletonRadius = 'control' | 'card' | 'pill';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: SkeletonRadius;
  className?: string;
}
