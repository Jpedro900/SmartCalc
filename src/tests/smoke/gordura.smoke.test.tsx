import { describe, it, expect } from "vitest";
import { render, screen } from "../utils/render";
import Page from "@/app/calculators/gordura/page";

describe("Smoke — gordura page", () => {
  it("renderiza sem crash", () => {
    const { baseElement } = render(<Page />);
    expect(baseElement).toBeTruthy();
  });

  it("possui pelo menos 1 botão ou input interativo", () => {
    render(<Page />);
    const buttons = screen.queryAllByRole("button");
    const inputs = screen.queryAllByRole("textbox");
    expect(buttons.length + inputs.length).toBeGreaterThan(0);
  });
});
