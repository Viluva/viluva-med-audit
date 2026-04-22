import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import InvestmentCalculatorsPage from "../app/investment-calculators/page";
import SIPCalculatorPage from "../app/sip-calculator/page";
import LumpsumCalculatorPage from "../app/lumpsum-calculator/page";
import SipLumpsumCalculatorPage from "../app/sip-lumpsum-calculator/page";
import SwpCalculatorPage from "../app/swp-calculator/page";

describe("Investment calculators UI", () => {
  it("renders the investment calculator hub with all calculator links", () => {
    render(<InvestmentCalculatorsPage />);

    expect(
      screen.getByRole("heading", {
        name: /plan contributions, growth, and withdrawals in one place/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /sip calculator/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /lumpsum calculator/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /sip \+ lumpsum/i }).length,
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("link", { name: /swp calculator/i }).length,
    ).toBeGreaterThan(0);
  });

  it("calculates the default SIP projection", () => {
    render(<SIPCalculatorPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /calculate sip returns/i }),
    );

    expect(screen.getByText(/projected sip value/i)).toBeInTheDocument();
    expect(screen.getByText(/₹23\.2\s*L/i)).toBeInTheDocument();
  });

  it("calculates the default lumpsum projection", () => {
    render(<LumpsumCalculatorPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /calculate lumpsum growth/i }),
    );

    expect(screen.getByText(/projected maturity value/i)).toBeInTheDocument();
    expect(screen.getByText(/₹15\.5\s*L/i)).toBeInTheDocument();
  });

  it("calculates the default combined SIP and lumpsum projection", () => {
    render(<SipLumpsumCalculatorPage />);

    fireEvent.click(
      screen.getByRole("button", { name: /calculate combined growth/i }),
    );

    expect(screen.getByText(/combined portfolio value/i)).toBeInTheDocument();
    expect(screen.getByText(/₹38\.8\s*L/i)).toBeInTheDocument();
  });

  it("calculates the default SWP outcome", () => {
    render(<SwpCalculatorPage />);

    fireEvent.click(screen.getByRole("button", { name: /plan my swp/i }));

    expect(screen.getByText(/swp outcome/i)).toBeInTheDocument();
    expect(
      screen.getByText(/your corpus supports the full withdrawal horizon/i),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/₹10\.2\s*L/i).length).toBeGreaterThan(0);
  });
});
