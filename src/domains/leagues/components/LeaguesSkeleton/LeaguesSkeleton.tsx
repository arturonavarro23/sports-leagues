import { Skeleton } from '@/design-system/components/Skeleton';
import type { LeaguesSkeletonProps } from './LeaguesSkeleton.types';

const DEFAULT_CARD_COUNT = 6;

// Mirrors the filters row and the card grid so swapping the real content in
// shifts nothing. The header is not included: it lives in AppLayout and is
// already on screen while this renders.
export function LeaguesSkeleton({
  cardCount = DEFAULT_CARD_COUNT,
}: LeaguesSkeletonProps) {
  return (
    <div aria-busy="true">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Skeleton height={72} className="w-full" />
          </div>
          <div className="sm:w-56">
            <Skeleton height={72} className="w-full" />
          </div>
        </div>
        <Skeleton height={20} width={140} />
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardCount }, (_, index) => (
          <li key={index}>
            <Skeleton height={160} radius="card" className="w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
