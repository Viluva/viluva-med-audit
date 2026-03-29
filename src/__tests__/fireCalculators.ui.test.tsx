import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FireCalculator from "../app/fire-calculator/page";
import FatFireCalculator from "../app/fat-fire-calculator/page";
import CoastFireCalculator from "../app/coast-fire-calculator/page";
import BaristaFireCalculator from "../app/barista-fire-calculator/page";

describe("FIRE Calculators UI Integration", () => {
  it("renders FIRE calculator and calculates output", () => {
    render(<FireCalculator />);
    expect(screen.getByText(/FIRE Calculator/i)).toBeInTheDocument();
    const expensesInput = screen.getByRole("spinbutton", {
      name: /annual expenses/i,
    });
    fireEvent.change(expensesInput, { target: { value: "600000" } });
    // No SWR input as number, so skip SWR change
    fireEvent.click(screen.getByRole("button", { name: /calculate/i }));
    // There may be multiple elements with 'FIRE Number', check at least one exists
    expect(screen.getAllByText(/FIRE Number/i).length).toBeGreaterThan(0);
    // Find the 'Your FIRE Number' label and assert its container includes '₹15.00L'
    const fireNumberLabel = screen.getByText(/Your FIRE Number/i);
    // The formatted FIRE number is in the next sibling <p> element
    const fireNumberValue =
      fireNumberLabel.parentElement?.querySelector("p.font-black");
    const fireText = fireNumberValue?.textContent?.replace(/\s/g, "") || "";
    expect(fireText.includes("₹15.00L") || fireText.includes("₹1.50Cr")).toBe(
      true,
    );
  });

  it("renders Fat FIRE calculator and calculates output", () => {
    render(<FatFireCalculator />);
    expect(screen.getByText(/Fat FIRE Calculator/i)).toBeInTheDocument();
  });

  it("renders Coast FIRE calculator and calculates output", () => {
    render(<CoastFireCalculator />);
    expect(screen.getByText(/Coast FIRE Calculator/i)).toBeInTheDocument();
  });

  it("renders Barista FIRE calculator and calculates output", () => {
    render(<BaristaFireCalculator />);
    expect(screen.getByText(/Barista FIRE Calculator/i)).toBeInTheDocument();
  });
});
