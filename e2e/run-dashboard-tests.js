#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

// Test configuration
const testFiles = [
  'e2e/cambigo-dashboard-tests.spec.ts',
  'e2e/cambigo-dashboard-testing-plan.spec.ts'
];

const testSuites = {
  'all': 'Run all dashboard tests',
  'auth': 'Run authentication tests only',
  'navigation': 'Run navigation tests only',
  'cards': 'Run flow creation card tests only',
  'creation': 'Run flow creation process tests only',
  'visual': 'Run visual verification tests only'
};

function runTests(suite = 'all') {
  console.log(`🚀 Running Cambigo Dashboard Tests: ${suite}`);
  console.log('=' .repeat(50));
  
  let grepPattern = '';
  
  switch (suite) {
    case 'auth':
      grepPattern = '--grep "Authentication|URL and Page Load"';
      break;
    case 'navigation':
      grepPattern = '--grep "Dashboard Navigation"';
      break;
    case 'cards':
      grepPattern = '--grep "Flow Creation Cards"';
      break;
    case 'creation':
      grepPattern = '--grep "Flow Creation Process"';
      break;
    case 'visual':
      grepPattern = '--grep "Visual Verification"';
      break;
    default:
      grepPattern = '--grep "Cambigo Dashboard"';
  }
  
  try {
    const command = `pnpm run e2e:headless ${grepPattern}`;
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    console.log('✅ Tests completed successfully!');
  } catch (error) {
    console.error('❌ Tests failed!');
    console.error(error.message);
    process.exit(1);
  }
}

function showHelp() {
  console.log('Cambigo Dashboard Test Runner');
  console.log('Usage: node run-dashboard-tests.js [suite]');
  console.log('');
  console.log('Available test suites:');
  
  Object.entries(testSuites).forEach(([key, description]) => {
    console.log(`  ${key.padEnd(12)} - ${description}`);
  });
  
  console.log('');
  console.log('Examples:');
  console.log('  node run-dashboard-tests.js all');
  console.log('  node run-dashboard-tests.js auth');
  console.log('  node run-dashboard-tests.js cards');
}

// Parse command line arguments
const args = process.argv.slice(2);
const suite = args[0] || 'all';

if (args.includes('--help') || args.includes('-h')) {
  showHelp();
  process.exit(0);
}

if (!testSuites[suite]) {
  console.error(`❌ Invalid test suite: ${suite}`);
  console.error('Available suites:', Object.keys(testSuites).join(', '));
  process.exit(1);
}

runTests(suite);