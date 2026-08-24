/**
 * Lightweight, robust test framework with colorized output and assertion tracking.
 */

export interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  error?: Error | string;
  durationMs: number;
  assertionCount: number;
}

export interface SuiteStats {
  name: string;
  tier: number;
  total: number;
  passed: number;
  failed: number;
  assertions: number;
  durationMs: number;
}

class TestContext {
  private currentSuite = 'Global';
  private currentTier = 1;
  private results: TestResult[] = [];
  private currentAssertions = 0;

  setSuite(name: string, tier = 1) {
    this.currentSuite = name;
    this.currentTier = tier;
  }

  getSuite() {
    return this.currentSuite;
  }

  getTier() {
    return this.currentTier;
  }

  incrementAssertion() {
    this.currentAssertions++;
  }

  recordResult(result: TestResult) {
    this.results.push(result);
  }

  getResults() {
    return [...this.results];
  }

  resetAssertionCount() {
    const count = this.currentAssertions;
    this.currentAssertions = 0;
    return count;
  }
}

export const context = new TestContext();

export class Expectation<T> {
  constructor(private actual: T, private description?: string) {}

  private fail(message: string) {
    const desc = this.description ? ` [${this.description}]` : '';
    throw new Error(`Assertion failed${desc}: ${message}`);
  }

  toBe(expected: T) {
    context.incrementAssertion();
    if (this.actual !== expected) {
      this.fail(`Expected ${JSON.stringify(expected)} but got ${JSON.stringify(this.actual)}`);
    }
    return this;
  }

  toEqual(expected: unknown) {
    context.incrementAssertion();
    const actualStr = JSON.stringify(this.actual);
    const expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
      this.fail(`Expected deep equality:\n  Expected: ${expectedStr}\n  Actual:   ${actualStr}`);
    }
    return this;
  }

  toBeTruthy() {
    context.incrementAssertion();
    if (!this.actual) {
      this.fail(`Expected truthy value but got ${JSON.stringify(this.actual)}`);
    }
    return this;
  }

  toBeFalsy() {
    context.incrementAssertion();
    if (this.actual) {
      this.fail(`Expected falsy value but got ${JSON.stringify(this.actual)}`);
    }
    return this;
  }

  toBeNull() {
    context.incrementAssertion();
    if (this.actual !== null) {
      this.fail(`Expected null but got ${JSON.stringify(this.actual)}`);
    }
    return this;
  }

  toBeDefined() {
    context.incrementAssertion();
    if (this.actual === undefined) {
      this.fail('Expected value to be defined');
    }
    return this;
  }

  toContain(expectedSubstringOrItem: unknown) {
    context.incrementAssertion();
    if (typeof this.actual === 'string' && typeof expectedSubstringOrItem === 'string') {
      if (!this.actual.includes(expectedSubstringOrItem)) {
        this.fail(`Expected string to contain "${expectedSubstringOrItem}", got:\n"${this.actual.slice(0, 150)}..."`);
      }
    } else if (Array.isArray(this.actual)) {
      if (!this.actual.includes(expectedSubstringOrItem)) {
        this.fail(`Expected array to contain item ${JSON.stringify(expectedSubstringOrItem)}`);
      }
    } else {
      this.fail(`toContain not supported for type ${typeof this.actual}`);
    }
    return this;
  }

  toMatch(regex: RegExp) {
    context.incrementAssertion();
    if (typeof this.actual !== 'string' || !regex.test(this.actual)) {
      this.fail(`Expected "${this.actual}" to match pattern ${regex}`);
    }
    return this;
  }

  toBeGreaterThan(expected: number) {
    context.incrementAssertion();
    if (typeof this.actual !== 'number' || this.actual <= expected) {
      this.fail(`Expected ${this.actual} to be greater than ${expected}`);
    }
    return this;
  }

  toBeGreaterThanOrEqual(expected: number) {
    context.incrementAssertion();
    if (typeof this.actual !== 'number' || this.actual < expected) {
      this.fail(`Expected ${this.actual} to be greater than or equal to ${expected}`);
    }
    return this;
  }

  toBeLessThan(expected: number) {
    context.incrementAssertion();
    if (typeof this.actual !== 'number' || this.actual >= expected) {
      this.fail(`Expected ${this.actual} to be less than ${expected}`);
    }
    return this;
  }

  toBeLessThanOrEqual(expected: number) {
    context.incrementAssertion();
    if (typeof this.actual !== 'number' || this.actual > expected) {
      this.fail(`Expected ${this.actual} to be less than or equal to ${expected}`);
    }
    return this;
  }

  toBeCloseTo(expected: number, delta = 0.01) {
    context.incrementAssertion();
    if (typeof this.actual !== 'number' || Math.abs(this.actual - expected) > delta) {
      this.fail(`Expected ${this.actual} to be close to ${expected} within ±${delta}`);
    }
    return this;
  }

  toThrow(expectedErrorPattern?: RegExp | string) {
    context.incrementAssertion();
    if (typeof this.actual !== 'function') {
      this.fail('Expected actual value to be a function');
    }
    let threw = false;
    let thrownError: unknown;
    try {
      (this.actual as () => unknown)();
    } catch (e) {
      threw = true;
      thrownError = e;
    }
    if (!threw) {
      this.fail('Expected function to throw an error, but it did not throw');
    }
    if (expectedErrorPattern && thrownError instanceof Error) {
      if (typeof expectedErrorPattern === 'string' && !thrownError.message.includes(expectedErrorPattern)) {
        this.fail(`Expected error message to include "${expectedErrorPattern}", got "${thrownError.message}"`);
      } else if (expectedErrorPattern instanceof RegExp && !expectedErrorPattern.test(thrownError.message)) {
        this.fail(`Expected error message to match ${expectedErrorPattern}, got "${thrownError.message}"`);
      }
    }
    return this;
  }
}

export function expect<T>(actual: T, description?: string): Expectation<T> {
  return new Expectation(actual, description);
}

export type TestFn = () => void | Promise<void>;

interface RegisteredSuite {
  name: string;
  tier: number;
  tests: { name: string; fn: TestFn }[];
}

const registeredSuites: RegisteredSuite[] = [];
let currentSuiteObj: RegisteredSuite | null = null;

export function describe(suiteName: string, tier = 1, defineTests: () => void) {
  const previousSuite = currentSuiteObj;
  currentSuiteObj = {
    name: suiteName,
    tier,
    tests: [],
  };
  registeredSuites.push(currentSuiteObj);
  defineTests();
  currentSuiteObj = previousSuite;
}

export function it(testName: string, fn: TestFn) {
  if (!currentSuiteObj) {
    throw new Error('Test defined outside describe block');
  }
  currentSuiteObj.tests.push({ name: testName, fn });
}

export async function runAllSuites(): Promise<{
  results: TestResult[];
  stats: SuiteStats[];
  totalAssertions: number;
  passedCount: number;
  failedCount: number;
  durationMs: number;
}> {
  const startTime = Date.now();
  const results: TestResult[] = [];
  const statsMap = new Map<string, SuiteStats>();

  for (const suite of registeredSuites) {
    context.setSuite(suite.name, suite.tier);
    let suiteAssertions = 0;
    let suitePassed = 0;
    let suiteFailed = 0;
    const suiteStartTime = Date.now();

    for (const test of suite.tests) {
      context.resetAssertionCount();
      const testStart = Date.now();
      let passed = true;
      let error: Error | string | undefined;

      try {
        await test.fn();
      } catch (err) {
        passed = false;
        error = err instanceof Error ? err : String(err);
      }

      const durationMs = Date.now() - testStart;
      const testAssertions = context.resetAssertionCount();
      suiteAssertions += testAssertions;

      if (passed) {
        suitePassed++;
      } else {
        suiteFailed++;
      }

      const res: TestResult = {
        suite: suite.name,
        name: test.name,
        passed,
        error,
        durationMs,
        assertionCount: testAssertions,
      };

      results.push(res);
      context.recordResult(res);
    }

    const suiteDuration = Date.now() - suiteStartTime;
    statsMap.set(suite.name, {
      name: suite.name,
      tier: suite.tier,
      total: suite.tests.length,
      passed: suitePassed,
      failed: suiteFailed,
      assertions: suiteAssertions,
      durationMs: suiteDuration,
    });
  }

  const durationMs = Date.now() - startTime;
  const totalAssertions = results.reduce((acc, r) => acc + r.assertionCount, 0);
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return {
    results,
    stats: Array.from(statsMap.values()),
    totalAssertions,
    passedCount,
    failedCount,
    durationMs,
  };
}
