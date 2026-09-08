import { render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { DocumentTranslations } from "@/components/document-translations"
import i18n from "@/i18n"

describe("DocumentTranslations", () => {
  afterEach(async () => {
    await i18n.changeLanguage("en")
  })

  it("updates legacy copy and accessibility labels when the language changes", async () => {
    await i18n.changeLanguage("en")
    render(
      <>
        <DocumentTranslations />
        <h1>Products</h1>
        <button aria-label="Decrease Daily Balance quantity">−</button>
      </>
    )

    await i18n.changeLanguage("ms")

    expect(await screen.findByRole("heading", { name: "Produk" })).toBeVisible()
    expect(
      screen.getByRole("button", {
        name: "Kurangkan kuantiti Daily Balance",
      })
    ).toBeVisible()

    await i18n.changeLanguage("zh")

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "产品" })).toBeVisible()
    })
  })
})
