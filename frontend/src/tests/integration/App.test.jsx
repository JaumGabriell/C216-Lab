import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "../../App";

function mockResponse(data, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  };
}

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("exibe mensagem de carregamento enquanto busca usuários", async () => {
    let resolveRequest;

    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        }),
    );

    render(<App />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledOnce();
    });

    expect(screen.getByText("Carregando usuários...")).toBeInTheDocument();

    resolveRequest(mockResponse([]));

    await waitFor(() => {
      expect(
        screen.queryByText("Carregando usuários..."),
      ).not.toBeInTheDocument();
    });
  });

  it("lista os usuários retornados pela API", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse([
        {
          id: 1,
          name: "João Gabriel",
          email: "joao@email.com",
        },
      ]),
    );

    render(<App />);

    expect(await screen.findByText("João Gabriel")).toBeInTheDocument();
    expect(screen.getByText("joao@email.com")).toBeInTheDocument();
  });

  it("cadastra um usuário pela API e atualiza a lista", async () => {
    const user = userEvent.setup();

    const newUser = {
      id: 2,
      name: "Maria Silva",
      email: "maria@email.com",
    };

    fetch
      .mockResolvedValueOnce(mockResponse([]))
      .mockResolvedValueOnce(mockResponse(newUser, 201));

    render(<App />);

    await screen.findByText("Usuários cadastrados");

    await user.type(screen.getByLabelText("Nome do Usuário"), "Maria Silva");
    await user.type(screen.getByLabelText("E-mail"), "maria@email.com");
    await user.type(screen.getByLabelText("Senha"), "123456");

    await user.click(screen.getByRole("button", { name: "Adicionar Usuário" }));

    expect(await screen.findByText("Maria Silva")).toBeInTheDocument();
    expect(screen.getByText("maria@email.com")).toBeInTheDocument();

    expect(fetch).toHaveBeenCalledTimes(2);

    const [url, options] = fetch.mock.calls[1];

    expect(url).toContain("/users/");
    expect(options.method).toBe("POST");

    expect(JSON.parse(options.body)).toEqual({
      name: "Maria Silva",
      email: "maria@email.com",
      password: "123456",
    });
  });

  it("exibe mensagem de erro quando a API falha", async () => {
    fetch.mockResolvedValueOnce(
      mockResponse({ detail: "Internal Server Error" }, 500),
    );

    render(<App />);

    expect(
      await screen.findByText("Erro ao listar usuários"),
    ).toBeInTheDocument();
  });
});
