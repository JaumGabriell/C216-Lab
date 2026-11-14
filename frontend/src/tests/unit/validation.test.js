import { describe, expect, it } from "vitest";
import { validateUser } from "../../validation";

describe("validateUser", () => {
  it("rejeita usuários com nome vazio", () => {
    const result = validateUser({
      name: "",
      email: "joao@email.com",
      password: "123456",
    });

    expect(result.errors.name).toBeDefined();
  });

  it("rejeita nomes maiores que 100 caracteres", () => {
    const result = validateUser({
      name: "A".repeat(101),
      email: "joao@email.com",
      password: "123456",
    });

    expect(result.errors.name).toBeDefined();
  });

  it("rejeita e-mails vazios", () => {
    const result = validateUser({
      name: "João",
      email: "",
      password: "123456",
    });

    expect(result.errors.email).toBeDefined();
  });

  it("rejeita e-mails inválidos", () => {
    const result = validateUser({
      name: "João",
      email: "joao@email",
      password: "123456",
    });

    expect(result.errors.email).toBe("Informe um e-mail válido.");
  });

  it("rejeita senhas vazias", () => {
    const result = validateUser({
      name: "João",
      email: "joao@email.com",
      password: "",
    });

    expect(result.errors.password).toBeDefined();
  });

  it("aceita usuários com dados válidos", () => {
    const result = validateUser({
      name: "João Gabriel",
      email: "joao@email.com",
      password: "123456",
    });

    expect(result.errors).toEqual({});

    expect(result.values).toEqual({
      name: "João Gabriel",
      email: "joao@email.com",
      password: "123456",
    });
  });
});
