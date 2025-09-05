import React from "react";
import { render as rtlRender, RenderOptions } from "@testing-library/react";
export * from "@testing-library/react";

export function render(ui: React.ReactElement, options?: RenderOptions) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <React.StrictMode>{children}</React.StrictMode>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...options });
}
