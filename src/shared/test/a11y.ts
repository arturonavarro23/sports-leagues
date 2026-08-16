import axe, { type AxeResults, type RunOptions } from 'axe-core';
import { expect } from 'vitest';

const DEFAULT_OPTIONS: RunOptions = {
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  },
};

export async function runAxe(
  container: Element,
  options: RunOptions = DEFAULT_OPTIONS,
): Promise<AxeResults> {
  return axe.run(container, options);
}

export async function expectNoAxeViolations(
  container: Element,
  options?: RunOptions,
): Promise<void> {
  const results = await runAxe(container, options);
  const summary = results.violations
    .map(
      (violation) =>
        `${violation.id}: ${violation.help} (${violation.nodes.length} node(s))`,
    )
    .join('\n');

  expect(summary, `Accessibility violations found:\n${summary}`).toBe('');
}
