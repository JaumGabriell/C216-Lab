import { describe, it, expect } from "vitest";
import { validateItem } from "../../validation";

describe("validateItem", () => {
  it("rejeita itens com nome vazio", () => {
    const result = validateItem({ name: "", description: "" });
    expect(result.errors.name).toBeDefined();
  });
});
