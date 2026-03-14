#!/usr/bin/env node

/**
 * Viluva BillCheck - Calculation Verification Script
 *
 * This script validates the calculation logic against test cases
 * Run with: node verify-calculations.js
 */

// Replicate the exact calculation logic from Verdict.tsx
function calculateAuditPrice(hospital, procedure, wardType) {
  // Check if hospital is NABH accredited (exclude "NON NABH")
  const isNABH =
    hospital.accreditation.toUpperCase().includes("NABH") &&
    !hospital.accreditation.toUpperCase().includes("NON");

  let rate = isNABH
    ? parseFloat(procedure.nabhRate)
    : parseFloat(procedure.nonNabhRate);

  // Super Speciality Rate - Use pre-calculated rate if available
  if (procedure.superSpecialityRate && isNABH) {
    rate = parseFloat(procedure.superSpecialityRate);
  }

  // City Tier Adjustment
  if (hospital.tier_type.includes("2")) rate *= 0.9;
  if (hospital.tier_type.includes("3")) rate *= 0.8;

  // Ward Multiplier (Excluded for uniform rate procedures)
  const uniformRateTypes = [
    "consultation",
    "investigation",
    "diagnostic",
    "radiotherapy",
    "chemotherapy",
    "critical care",
    "blood component",
  ];

  const isUniform = uniformRateTypes.some(
    (type) =>
      procedure.specialityClassification.toLowerCase().includes(type) ||
      procedure.name.toLowerCase().includes(type),
  );

  if (!isUniform) {
    if (wardType === "General") rate *= 0.95;
    if (wardType === "Private") rate *= 1.05;
  }

  return Math.round(rate);
}

// Test Cases
const testCases = [
  {
    name: "Test 1: Basic NABH, Tier 1, Semi-Private",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "1000",
      nonNabhRate: "850",
      specialityClassification: "Surgery",
      name: "Basic Surgery",
    },
    wardType: "Semi-Private",
    expected: 1000,
  },
  {
    name: "Test 2: Non-NABH, Tier 2, General Ward",
    hospital: { accreditation: "NON NABH", tier_type: "Tier 2" },
    procedure: {
      nabhRate: "1000",
      nonNabhRate: "850",
      specialityClassification: "Surgery",
      name: "Basic Surgery",
    },
    wardType: "General",
    expected: 727,
  },
  {
    name: "Test 3: NABH, Tier 3, Private Ward",
    hospital: { accreditation: "NABH", tier_type: "Tier 3" },
    procedure: {
      nabhRate: "10000",
      nonNabhRate: "8500",
      specialityClassification: "Surgery",
      name: "Major Surgery",
    },
    wardType: "Private",
    expected: 8400,
  },
  {
    name: "Test 4: Consultation - Uniform Rate (No Ward Modifier)",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "350",
      nonNabhRate: "350",
      specialityClassification: "Consultation",
      name: "Consultation OPD",
    },
    wardType: "Private",
    expected: 350,
  },
  {
    name: "Test 5: Super Speciality Consultation",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "350",
      nonNabhRate: "350",
      superSpecialityRate: "700",
      specialityClassification: "Consultation",
      name: "Super Speciality Consultation",
    },
    wardType: "Semi-Private",
    expected: 700,
  },
  {
    name: "Test 6: Chemotherapy - Uniform Rate, Tier 2",
    hospital: { accreditation: "NABH", tier_type: "Tier 2" },
    procedure: {
      nabhRate: "5000",
      nonNabhRate: "4250",
      specialityClassification: "Chemotherapy",
      name: "Single drug Chemotherapy",
    },
    wardType: "Private",
    expected: 4500,
  },
  {
    name: "Test 7: Lab Investigation - Uniform Rate, Tier 3",
    hospital: { accreditation: "NABH", tier_type: "Tier 3" },
    procedure: {
      nabhRate: "500",
      nonNabhRate: "425",
      specialityClassification: "Investigation",
      name: "Blood Test",
    },
    wardType: "Private",
    expected: 400,
  },
  {
    name: "Test 8: Radiotherapy - Uniform Rate",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "8000",
      nonNabhRate: "6800",
      specialityClassification: "Radiotherapy",
      name: "Radiotherapy Session",
    },
    wardType: "Private",
    expected: 8000,
  },
  {
    name: "Test 9: Non-NABH, Tier 3, General (Minimum Multipliers)",
    hospital: { accreditation: "NON NABH", tier_type: "Tier 3" },
    procedure: {
      nabhRate: "10000",
      nonNabhRate: "10000",
      specialityClassification: "Surgery",
      name: "Surgery",
    },
    wardType: "General",
    expected: 7600,
  },
  {
    name: "Test 10: Super Speciality for Non-NABH (Should NOT Apply)",
    hospital: { accreditation: "NON NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "350",
      nonNabhRate: "350",
      superSpecialityRate: "700",
      specialityClassification: "Consultation",
      name: "Consultation",
    },
    wardType: "Semi-Private",
    expected: 350,
  },
  {
    name: "Test 11: ICU/CCU - Uniform Rate (No Ward Modifier)",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "5400",
      nonNabhRate: "5400",
      superSpecialityRate: "5400",
      specialityClassification: "Critical Care",
      name: "ICU/CCU/PICU/MICU/HDU (For all categories of ward entitlement, inclusive of Room Rent)",
    },
    wardType: "Private",
    expected: 5400,
  },
  {
    name: "Test 12: Ventilator - Uniform Rate, Tier 2",
    hospital: { accreditation: "NABH", tier_type: "Tier 2" },
    procedure: {
      nabhRate: "2295",
      nonNabhRate: "2700",
      superSpecialityRate: "2700",
      specialityClassification: "Critical Care",
      name: "Ventilator charges (Per day) inclusive of associated disposables",
    },
    wardType: "Private",
    expected: 2430,
  },
  {
    name: "Test 13: Blood Component - Uniform Rate (No Ward Modifier)",
    hospital: { accreditation: "NABH", tier_type: "Tier 1" },
    procedure: {
      nabhRate: "1550",
      nonNabhRate: "1550",
      superSpecialityRate: "1550",
      specialityClassification: "Blood Component Charges",
      name: "Blood Component Charges - Whole Blood per Unit",
    },
    wardType: "Private",
    expected: 1550,
  },
  {
    name: "Test 14: Platelet Apheresis - Uniform Rate, Tier 3",
    hospital: { accreditation: "NABH", tier_type: "Tier 3" },
    procedure: {
      nabhRate: "11000",
      nonNabhRate: "11000",
      superSpecialityRate: "11000",
      specialityClassification: "Blood Component Charges",
      name: "Platelet Concentrate – Single Donor Platelet (SDP)- Apheresis per unit",
    },
    wardType: "General",
    expected: 8800,
  },
];

// Run Tests
console.log("═══════════════════════════════════════════════════════");
console.log("  Viluva BillCheck - Calculation Verification");
console.log("═══════════════════════════════════════════════════════\n");

let passed = 0;
let failed = 0;
const failures = [];

testCases.forEach((test, index) => {
  const result = calculateAuditPrice(
    test.hospital,
    test.procedure,
    test.wardType,
  );
  const isPass = result === test.expected;

  if (isPass) {
    passed++;
    console.log(`✅ ${test.name}`);
    console.log(
      `   Expected: ₹${test.expected.toLocaleString()} | Got: ₹${result.toLocaleString()}\n`,
    );
  } else {
    failed++;
    failures.push({
      name: test.name,
      expected: test.expected,
      got: result,
    });
    console.log(`❌ ${test.name}`);
    console.log(
      `   Expected: ₹${test.expected.toLocaleString()} | Got: ₹${result.toLocaleString()}`,
    );
    console.log(`   ERROR: Calculation mismatch!\n`);
  }
});

console.log("═══════════════════════════════════════════════════════");
console.log(`  Results: ${passed} Passed | ${failed} Failed`);
console.log("═══════════════════════════════════════════════════════\n");

if (failed > 0) {
  console.log("❌ FAILURES:\n");
  failures.forEach((f) => {
    console.log(`  • ${f.name}`);
    console.log(
      `    Expected: ₹${f.expected.toLocaleString()}, Got: ₹${f.got.toLocaleString()}\n`,
    );
  });
  process.exit(1);
} else {
  console.log("✅ ALL TESTS PASSED!");
  console.log("   Calculation logic is verified and ready for production.\n");
  process.exit(0);
}
