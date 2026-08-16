import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebouncedValue('initial', 200));
    expect(result.current).toBe('initial');
  });

  it('does not update before the delay has elapsed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });
    act(() => {
      vi.advanceTimersByTime(199);
    });

    expect(result.current).toBe('initial');
  });

  it('updates after the delay has elapsed', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('updated');
  });

  it('cancels a pending update when the value changes again', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'first-change' });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    rerender({ value: 'second-change' });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('initial');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('second-change');
  });

  it('cleans up the pending timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { rerender, unmount } = renderHook(
      ({ value }) => useDebouncedValue(value, 200),
      { initialProps: { value: 'initial' } },
    );

    rerender({ value: 'updated' });
    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
