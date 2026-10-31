import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "../../App";

describe("App", () => {
  it("adiciona um item à lista", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.type(screen.getByLabelText("Nome"), "Notebook");
    await user.type(screen.getByLabelText("Descrição"), "Computador portátil");

    await user.click(screen.getByRole("button", { name: "Adicionar item" }));

    expect(screen.getByText("Notebook")).toBeInTheDocument();
    expect(screen.getByText("Computador portátil")).toBeInTheDocument();
  });
});
