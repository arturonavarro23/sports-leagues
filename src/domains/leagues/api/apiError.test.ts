import { describe, expect, it } from 'vitest';
import { ApiError } from './apiError';

describe('ApiError', () => {
  it('is a real Error subclass', () => {
    const error = new ApiError(404, 'Not found');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
  });

  it('carries the status and message', () => {
    const error = new ApiError(500, 'Server error');
    expect(error.status).toBe(500);
    expect(error.message).toBe('Server error');
  });

  it('sets the error name', () => {
    const error = new ApiError(400, 'Bad request');
    expect(error.name).toBe('ApiError');
  });
});
