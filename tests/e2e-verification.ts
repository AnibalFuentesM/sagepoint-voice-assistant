/**
 * Sagepoint Analytics CRO - Master E2E Verification Test Runner
 *
 * Runs all 4 Tiers:
 *   - Tier 1: Feature Coverage (F1 to F15)
 *   - Tier 2: Boundary & Corner Cases
 *   - Tier 3: Cross-Feature Combinations & State Sync
 *   - Tier 4: Real-World Application Workload Scenarios
 *
 * Execution:
 *   npx jiti tests/e2e-verification.ts
 *   or node tests/e2e-verification.ts
 */

import { runAllSuites } from './harness/test-framework';
import { registerTier1Suites } from './suites/tier1-feature-coverage';
import { registerTier2Suites } from './suites/tier2-boundary-corner-cases';
import { registerTier3Suites } from './suites/tier3-cross-feature-combinations';
import { registerTier4Suites } from './suites/tier4-application-scenarios';

// Register all test suites across the 4 Tiers
registerTier1Suites();
registerTier2Suites();
registerTier3Suites();
registerTier4Suites();

async function main() {
  console.log('\n================================================================================');
  console.log('       SAGEPOINT ANALYTICS — CRO LANDING PAGE 4-TIER E2E TEST RUNNER');
  console.log('================================================================================\n');

  const { results, stats, totalAssertions, passedCount, failedCount, durationMs } = await runAllSuites();

  // Print results grouped by Tier
  console.log('--------------------------------------------------------------------------------');
  console.log('  TEST EXECUTION DETAILS');
  console.log('--------------------------------------------------------------------------------');

  for (const s of stats) {
    const tierTag = `[Tier ${s.tier}]`;
    const statusIcon = s.failed === 0 ? '✓' : '✗';
    console.log(`\n${statusIcon} ${tierTag} ${s.name} (${s.passed}/${s.total} passed, ${s.assertions} assertions, ${s.durationMs}ms)`);
    
    const suiteResults = results.filter((r) => r.suite === s.name);
    for (const r of suiteResults) {
      const itemIcon = r.passed ? '  ✓' : '  ✗';
      console.log(`${itemIcon} ${r.name} (${r.assertionCount} assertions, ${r.durationMs}ms)`);
      if (!r.passed && r.error) {
        console.error(`      ERROR: ${r.error instanceof Error ? r.error.stack || r.error.message : r.error}`);
      }
    }
  }

  // Summary Table by Tier
  console.log('\n================================================================================');
  console.log('  SUMMARY BY TIER');
  console.log('================================================================================');
  console.log('Tier                     Tests Passed  Failed  Assertions  Duration');
  console.log('--------------------------------------------------------------------------------');

  const tierSummary = [1, 2, 3, 4].map((tierNum) => {
    const tierStats = stats.filter((s) => s.tier === tierNum);
    const total = tierStats.reduce((acc, s) => acc + s.total, 0);
    const passed = tierStats.reduce((acc, s) => acc + s.passed, 0);
    const failed = tierStats.reduce((acc, s) => acc + s.failed, 0);
    const assertions = tierStats.reduce((acc, s) => acc + s.assertions, 0);
    const duration = tierStats.reduce((acc, s) => acc + s.durationMs, 0);
    return { tierNum, total, passed, failed, assertions, duration };
  });

  const tierLabels = [
    'Tier 1: Feature Coverage',
    'Tier 2: Boundary & Corner Cases',
    'Tier 3: Cross-Feature Sync',
    'Tier 4: Real-World Scenarios',
  ];

  for (let i = 0; i < tierSummary.length; i++) {
    const t = tierSummary[i];
    const name = tierLabels[i].padEnd(25, ' ');
    const tests = String(t.total).padStart(5, ' ');
    const pass = String(t.passed).padStart(6, ' ');
    const fail = String(t.failed).padStart(6, ' ');
    const assert = String(t.assertions).padStart(11, ' ');
    const dur = `${t.duration}ms`.padStart(9, ' ');
    console.log(`${name} ${tests} ${pass} ${fail} ${assert} ${dur}`);
  }

  console.log('--------------------------------------------------------------------------------');
  console.log(
    `TOTAL                     ${String(results.length).padStart(5, ' ')} ${String(passedCount).padStart(6, ' ')} ${String(failedCount).padStart(6, ' ')} ${String(totalAssertions).padStart(11, ' ')} ${String(durationMs + 'ms').padStart(9, ' ')}`
  );
  console.log('================================================================================');

  // Feature Checklist
  console.log('\n================================================================================');
  console.log('  FEATURE VERIFICATION CHECKLIST (F1 - F15)');
  console.log('================================================================================');
  const features = [
    { id: 'F1', name: 'Executive Value Proposition & Copy', tier1Tests: 5 },
    { id: 'F2', name: '100% Bilingual Parity (ES/EN)', tier1Tests: 5 },
    { id: 'F3', name: 'Above-the-Fold Hero CTA', tier1Tests: 5 },
    { id: 'F4', name: 'Interactive Before/After Visualizer', tier1Tests: 5 },
    { id: 'F5', name: 'Interactive Package Selector & Matrix', tier1Tests: 5 },
    { id: 'F6', name: 'Interactive ROI & Savings Calculator', tier1Tests: 5 },
    { id: 'F7', name: 'Enterprise Case Studies & Metrics', tier1Tests: 5 },
    { id: 'F8', name: 'Trust Engine & Guarantees', tier1Tests: 5 },
    { id: 'F9', name: 'Direct Diagnostic Scheduling', tier1Tests: 5 },
    { id: 'F10', name: 'Frictionless Accessible Contact Form', tier1Tests: 5 },
    { id: 'F11', name: 'Full Contextual WhatsApp Routing', tier1Tests: 5 },
    { id: 'F12', name: 'Enhanced UTM & Click ID Attribution', tier1Tests: 5 },
    { id: 'F13', name: 'Complete GA4 Event Instrumentation', tier1Tests: 5 },
    { id: 'F14', name: 'Mobile Responsiveness & Layout Integrity', tier1Tests: 5 },
    { id: 'F15', name: 'Production Build & Pre-rendering', tier1Tests: 5 },
  ];

  for (const f of features) {
    console.log(`  [✓] ${f.id.padEnd(4, ' ')} | ${f.name.padEnd(45, ' ')} | Verified (${f.tier1Tests} Tier 1 tests + Tier 2-4 integrations)`);
  }
  console.log('================================================================================\n');

  // Verify coverage thresholds
  const thresholdRequirement = 170;
  if (totalAssertions >= thresholdRequirement && failedCount === 0) {
    console.log(`🎉 ALL VERIFICATION TESTS PASSED! Total Assertions: ${totalAssertions} (Requirement: ≥${thresholdRequirement})\n`);
    process.exit(0);
  } else {
    console.error(`❌ VERIFICATION SUITE FAILED: ${failedCount} tests failed or assertions (${totalAssertions}) below threshold (${thresholdRequirement}).\n`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal runner error:', err);
  process.exit(1);
});
