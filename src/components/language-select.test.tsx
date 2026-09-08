import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, it } from "vitest"

import { LanguageSelect } from "@/components/language-select"
import i18n from "@/i18n"

describe("LanguageSelect", () => {
  afterEach(async () => {
    cleanup()
    await i18n.changeLanguage("en")
  })

  it("opens the language dropdown", async () => {
    render(<LanguageSelect />)

    fireEvent.click(screen.getByRole("button", { name: "Language" }))

    expect(
      await screen.findByRole("menuitemradio", { name: "Bahasa Melayu" })
    ).toBeVisible()
  })
})
