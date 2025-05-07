const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Pattern to find test result JSON files
const statsFilesPattern = path.join(__dirname, 'artifacts/*/merged.json');
const statsFiles = glob.sync(statsFilesPattern);

const outputDir = path.join(__dirname, 'merged-results');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('merged-results directory created');
}

const rows = [];

// Header for CSV
const headers = [
  'appName',
  'suites',
  'tests',
  'passes',
  'pending',
  'failures',
  'duration',
  'testsRegistered',
  'passPercent',
  'pendingPercent',
  'other',
  'hasOther',
  'skipped',
  'hasSkipped',
  'start',
  'end',
];

rows.push(headers.join(','));

statsFiles.forEach((file) => {
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'));
    const stats = data.stats;

    // Extract app name from folder pattern like fnsite-report-14883898516 -> fnsite
    const folderName = path.basename(path.dirname(file));
    const appNameMatch = folderName.match(/^(.+?)-report-/);
    const appName = appNameMatch ? appNameMatch[1] : folderName;

    const row = [
      appName,
      stats.suites ?? '',
      stats.tests ?? '',
      stats.passes ?? '',
      stats.pending ?? '',
      stats.failures ?? '',
      stats.duration ?? '',
      stats.testsRegistered ?? '',
      stats.passPercent ?? '',
      stats.pendingPercent ?? '',
      stats.other ?? '',
      stats.hasOther ?? '',
      stats.skipped ?? '',
      stats.hasSkipped ?? '',
      stats.start ?? '',
      stats.end ?? '',
    ];

    rows.push(row.join(','));
  } catch (err) {
    console.error(`Error processing ${file}:`, err);
  }
});

// Write CSV file
const csvPath = path.join(outputDir, 'test-stats-summary.csv');
try {
  fs.writeFileSync(csvPath, rows.join('\n'));
  console.log(`CSV summary written to ${csvPath}`);
} catch (err) {
  console.error('Error writing CSV file:', err);
}
// Write JSON file