import type { EmptyStateProps } from './EmptyState.types';

type HeadingTag = 'h2' | 'h3' | 'h4';

export function EmptyState({
  title,
  description,
  action,
  headingLevel = 3,
}: EmptyStateProps) {
  const Heading: HeadingTag = `h${headingLevel}`;

  return (
    <div className="rounded-card bg-surface-raised flex flex-col items-center gap-2 p-6 text-center">
      <Heading className="text-content-primary text-base font-semibold">
        {title}
      </Heading>
      {description ? (
        <p className="text-content-secondary text-sm">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
