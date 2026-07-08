import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { BottomTabBar } from "@/components/app/bottom-tab-bar";
import { defaultUiCopy as copy } from "@/lib/copy";

vi.mock("next/navigation", () => ({
  usePathname: () => "/practice",
}));

describe("BottomTabBar", () => {
  it("renders Russian tab labels from the shared copy dictionary", () => {
    render(<BottomTabBar />);

    expect(
      screen.getByRole("navigation", { name: copy.app.navigationLabel }),
    ).toBeInTheDocument();

    for (const label of Object.values(copy.app.tabs)) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });
});
