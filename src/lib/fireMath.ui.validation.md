# UI Input Validation Review & Suggestions

## Current State
- Inputs are required and have min/max attributes.
- No explicit handling for negative numbers, NaN, or empty strings.
- No user feedback for invalid values (e.g., negative, zero SWR).

## Recommendations
- Clamp all numeric inputs to valid ranges (e.g., SWR > 0, expenses >= 0).
- Show inline error messages for invalid values.
- Prevent form submission if any input is invalid.
- Add helper text for each field (e.g., "Enter your annual expenses in ₹").
- Consider using controlled components with validation state.

## Example (React):
```tsx
const [errors, setErrors] = useState({});

function validate(formData) {
  const errs = {};
  if (formData.expenses < 0) errs.expenses = "Expenses must be non-negative";
  if (formData.swr <= 0) errs.swr = "Withdrawal rate must be positive";
  // ...more
  return errs;
}

function handleSubmit(e) {
  e.preventDefault();
  const errs = validate(formData);
  setErrors(errs);
  if (Object.keys(errs).length > 0) return;
  // ...proceed
}
```

- Add aria-invalid and aria-describedby for accessibility.
- Use type="number" with step, min, max for all numeric fields.
