#!/usr/bin/env node
/**
 * Direct execution wrapper for e2e-verification.ts using jiti
 */
import { createJiti } from 'jiti';

const jiti = createJiti(import.meta.url);
await jiti.import('./e2e-verification.ts');
