// Credits: https://x.com/vovacodes/status/1989785877740982329?s=20

/**
 * Wraps an async function so that it always takes **at least** the given duration
 * before resolving. The function and the delay run at the same time, and the result
 * is returned only after both have finished.
 *
 * @template Args - The parameters of the wrapped function
 * @template R - The resolved return type of the wrapped function
 *
 * @param {number} durationInMs - Minimum number of milliseconds to wait
 * @param {(...args: Args) => Promise<R>} fn - The async function to wrap
 *
 * @returns {(...args: Args) => Promise<R>}
 * A new function that behaves like `fn` but guarantees a minimum duration.
 *
 * @example
 * const fetchUser = async (id: string) => {
 *   const res = await fetch(`/api/users/${id}`);
 *   return res.json();
 * };
 *
 * const delayedFetch = takeAtLeast(500, fetchUser);
 *
 * // This will never resolve faster than 500ms
 * const user = await delayedFetch("123");
 */

export function takeAtLeast<Args extends unknown[], R>(
  durationInMs: number,
  fn: (...args: Args) => Promise<R>
) {
  return async (...args: Args): Promise<R> => {
    const sleepPromise = new Promise<void>((resolve) => {
      setTimeout(resolve, durationInMs);
    });

    try {
      const [result] = await Promise.all([fn(...args), sleepPromise]);
      return result;
    } catch (error) {
      throw error;
    }
  };
}
