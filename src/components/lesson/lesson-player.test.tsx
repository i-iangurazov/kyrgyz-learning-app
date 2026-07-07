import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LessonPlayer } from "@/components/lesson/lesson-player";
import { lessons } from "@/content/curriculum";

describe("LessonPlayer", () => {
  it("renders the required lesson sections from lesson data", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(screen.getByTestId("lesson-player")).toBeInTheDocument();
    expect(screen.getByTestId("section-story")).toBeInTheDocument();
    expect(screen.getByTestId("section-vocabulary")).toBeInTheDocument();
    expect(screen.getByTestId("section-dialogue")).toBeInTheDocument();
    expect(screen.getByTestId("section-grammar")).toBeInTheDocument();
    expect(screen.getByTestId("section-exercise")).toBeInTheDocument();
    expect(screen.getByTestId("section-mini-game")).toBeInTheDocument();
    expect(screen.getByTestId("section-speaking")).toBeInTheDocument();
    expect(screen.getByTestId("section-ai-roleplay")).toBeInTheDocument();
    expect(screen.getByTestId("section-review")).toBeInTheDocument();
  });

  it("shows the seeded demo notice", () => {
    render(<LessonPlayer lesson={lessons[0]} />);

    expect(
      screen.getByText(/Sample\/demo content only/i),
    ).toBeInTheDocument();
  });
});
