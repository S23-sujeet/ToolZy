import { calculateAge } from '../src/lib/dateTools.ts';
import {
  calculateBmr,
  calculateDiscount,
  calculateGpa,
  calculateInterest,
  calculateSalesTax,
} from '../src/lib/calculators.ts';
import { convertUnit } from '../src/lib/unitConversion.ts';
import { convertCookingUnit } from '../src/lib/cookingTools.ts';
import { dedupeLines, diffLines, findAndReplace, formatJson, minifyJson, sortLines } from '../src/lib/textTools.ts';
import { generateHash } from '../src/lib/hashTools.ts';
import { flipCoins, generateUuid, randomInt, rollDice } from '../src/lib/idTools.ts';

const results: { name: string; pass: boolean; detail: string }[] = [];

function record(name: string, pass: boolean, detail: string) {
  results.push({ name, pass, detail });
  console.log(`${pass ? 'PASS' : 'FAIL'} - ${name}: ${detail}`);
}

// 1. Age calculator - exact birthday
{
  const r = calculateAge('2000-06-15', '2026-06-15');
  record('calculateAge exact birthday', r.years === 26 && r.months === 0 && r.days === 0, `years=${r.years} months=${r.months} days=${r.days}`);
}

// 2. Age calculator - day before birthday
{
  const r = calculateAge('2000-06-15', '2026-06-14');
  record(
    'calculateAge day before birthday',
    r.years === 25 && r.daysUntilNextBirthday === 1,
    `years=${r.years} daysUntilNextBirthday=${r.daysUntilNextBirthday}`,
  );
}

// 3. Discount calculator
{
  const r = calculateDiscount(100, 20);
  record('calculateDiscount 20% off 100', r.discountAmount === 20 && r.finalPrice === 80, `discountAmount=${r.discountAmount} finalPrice=${r.finalPrice}`);
}

// 4. Sales tax add mode
{
  const r = calculateSalesTax(100, 18, 'add');
  record('calculateSalesTax add', r.taxAmount === 18 && r.grossAmount === 118, `taxAmount=${r.taxAmount} grossAmount=${r.grossAmount}`);
}

// 5. Sales tax extract mode (inverse of add)
{
  const r = calculateSalesTax(118, 18, 'extract');
  record('calculateSalesTax extract', Math.abs(r.netAmount - 100) < 1e-9, `netAmount=${r.netAmount}`);
}

// 6. Simple interest
{
  const r = calculateInterest(1000, 10, 2, 'simple');
  record('calculateInterest simple', r.interest === 200 && r.total === 1200, `interest=${r.interest} total=${r.total}`);
}

// 7. Compound interest (annual compounding, known formula result)
{
  const r = calculateInterest(1000, 10, 2, 'compound', 1);
  record('calculateInterest compound annual', Math.abs(r.total - 1210) < 1e-9, `total=${r.total}`);
}

// 8. BMR (Mifflin-St Jeor, male, known reference values)
{
  const r = calculateBmr(70, 175, 30, 'male', 'sedentary');
  const expectedBmr = 10 * 70 + 6.25 * 175 - 5 * 30 + 5;
  record('calculateBmr male', Math.abs(r.bmr - expectedBmr) < 1e-9, `bmr=${r.bmr} expected=${expectedBmr}`);
}

// 9. GPA calculator
{
  const gpa = calculateGpa([
    { gradeKey: 'A', credits: 3 },
    { gradeKey: 'B', credits: 3 },
  ]);
  record('calculateGpa A+B evenly weighted', Math.abs(gpa - 3.5) < 1e-9, `gpa=${gpa}`);
}

// 10. Unit conversion - new area group
{
  const r = convertUnit(1, 'area', 'sqm', 'sqft');
  record('convertUnit area sqm->sqft', Math.abs(r - 10.7639) < 0.001, `result=${r}`);
}

// 11. Unit conversion - new speed group
{
  const r = convertUnit(100, 'speed', 'kmh', 'mps');
  record('convertUnit speed 100kmh->mps', Math.abs(r - 27.7778) < 0.001, `result=${r}`);
}

// 12. Unit conversion - new digital storage group (binary 1024-based)
{
  const r = convertUnit(1, 'digital', 'gb', 'mb');
  record('convertUnit digital 1gb->mb', r === 1024, `result=${r}`);
}

// 13. Cooking conversion - same family (cup -> tbsp)
{
  const r = convertCookingUnit(1, 'cup', 'tbsp', 'water');
  record('convertCookingUnit cup->tbsp', Math.abs(r - 16) < 0.01, `result=${r}`);
}

// 14. Cooking conversion - cross family (cup of water -> grams, density 1.0)
{
  const r = convertCookingUnit(1, 'cup', 'g', 'water');
  record('convertCookingUnit 1 cup water -> g', Math.abs(r - 236.588) < 0.01, `result=${r}`);
}

// 15. JSON formatter round-trip
{
  const pretty = formatJson('{"b":1,"a":2}', 2);
  const min = minifyJson(pretty);
  record('formatJson/minifyJson round-trip', min === '{"b":1,"a":2}', `min=${min}`);
}

// 16. JSON formatter invalid input throws friendly error
{
  try {
    formatJson('{not json}');
    record('formatJson invalid input throws', false, 'expected an error to be thrown');
  } catch (e) {
    record('formatJson invalid input throws', true, `threw as expected: ${(e as Error).message}`);
  }
}

// 17. Diff lines - simple add/remove/equal
{
  const d = diffLines('a\nb\nc', 'a\nx\nc');
  const types = d.map((l) => l.type).join(',');
  record('diffLines a/b/c vs a/x/c', types === 'equal,removed,added,equal', `types=${types}`);
}

// 18. Sort lines with dedupe
{
  const r = sortLines('banana\napple\napple\ncherry', { order: 'asc', caseSensitive: true, dedupe: true });
  record('sortLines asc+dedupe', r === 'apple\nbanana\ncherry', `result=${JSON.stringify(r)}`);
}

// 19. Dedupe lines case-insensitive
{
  const r = dedupeLines('Apple\napple\nBanana', false);
  record('dedupeLines case-insensitive', r === 'Apple\nBanana', `result=${JSON.stringify(r)}`);
}

// 20. Find and replace, plain text
{
  const r = findAndReplace('The quick fox', 'quick', 'slow', { useRegex: false, caseSensitive: true });
  record('findAndReplace plain', r === 'The slow fox', `result=${r}`);
}

// 21. Find and replace, regex
{
  const r = findAndReplace('a1 b2 c3', '\\d', '#', { useRegex: true, caseSensitive: true });
  record('findAndReplace regex', r === 'a# b# c#', `result=${r}`);
}

// 22. Hash generator - known SHA-256 answer for "abc"
{
  const hash = await generateHash('abc', 'SHA-256');
  const expected = 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad';
  record('generateHash SHA-256("abc")', hash === expected, `hash=${hash}`);
}

// 23. UUID generator format
{
  const uuid = generateUuid();
  const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
  record('generateUuid format', valid, `uuid=${uuid}`);
}

// 24. randomInt bounds
{
  const values = Array.from({ length: 200 }, () => randomInt(1, 6));
  const inBounds = values.every((v) => v >= 1 && v <= 6);
  record('randomInt stays in bounds', inBounds, `min=${Math.min(...values)} max=${Math.max(...values)}`);
}

// 25. rollDice count and bounds
{
  const rolls = rollDice(6, 5);
  record('rollDice count and bounds', rolls.length === 5 && rolls.every((r) => r >= 1 && r <= 6), `rolls=${rolls.join(',')}`);
}

// 26. flipCoins values
{
  const flips = flipCoins(10);
  const valid = flips.length === 10 && flips.every((f) => f === 'Heads' || f === 'Tails');
  record('flipCoins values', valid, `flips=${flips.join(',')}`);
}

const failed = results.filter((r) => !r.pass);
console.log(`\n${results.length - failed.length}/${results.length} passed.`);
if (failed.length > 0) process.exitCode = 1;
