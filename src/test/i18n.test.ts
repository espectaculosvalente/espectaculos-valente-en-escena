import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { parseLangParam, switchLangPath } from "@/i18n";

describe("idiomas", () => {
  it("galego é o idioma principal, sen prefixo", () => {
    expect(parseLangParam(undefined)).toBe("gl");
    expect(switchLangPath("/es/compania", "gl")).toBe("/compania");
  });

  it("castelán e inglés levan prefixo /es e /en", () => {
    expect(parseLangParam("es")).toBe("es");
    expect(parseLangParam("en")).toBe("en");
    expect(switchLangPath("/compania", "es")).toBe("/es/compania");
    expect(switchLangPath("/es/compania", "en")).toBe("/en/compania");
    expect(switchLangPath("/", "en")).toBe("/en");
  });

  it("calquera outro prefixo non é un idioma válido", () => {
    expect(parseLangParam("fr")).toBeNull();
    expect(parseLangParam("gl")).toBeNull();
  });

  it("as páxinas en galego e nos idiomas secundarios resolven á mesma ruta", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const id = (p: string) => router.matchRoutes(p).at(-1)?.routeId;
    expect(id("/compania")).toBe("/{-$lang}/compania");
    expect(id("/es/compania")).toBe("/{-$lang}/compania");
    expect(id("/en/espectaculos/espectaculo-1")).toBe("/{-$lang}/espectaculos/$slug");
  });
});
