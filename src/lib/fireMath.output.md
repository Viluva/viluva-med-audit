# Output Transparency & Assumptions

## Recommendations
- Always display a summary of key assumptions below results:
  - Withdrawal rate (SWR)
  - Return rate (pre-tax, pre-inflation unless otherwise stated)
  - Inflation rate (if used)
  - All savings assumed invested at return rate
  - No taxes or fees considered (unless implemented)
- Show a breakdown of calculations (e.g., how FIRE number is derived)
- For advanced calculators, show the full timeline and intermediate values

## Example (UI):
```tsx
<div className="mt-6 text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-xl p-4">
  <p><strong>Assumptions:</strong></p>
  <ul className="list-disc ml-5">
    <li>Withdrawal rate: {swr}%</li>
    <li>Return rate: {returnRate * 100}% (nominal, pre-tax)</li>
    <li>All savings invested at return rate</li>
    <li>No inflation or taxes considered</li>
  </ul>
  <p className="mt-2">FIRE number = annual expenses / withdrawal rate</p>
</div>
```
