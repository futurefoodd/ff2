import { ChevronDown, Languages } from "lucide-react"
import { useTranslation } from "react-i18next"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const languages = [
  { value: "en", label: "English" },
  { value: "ms", label: "Bahasa Melayu" },
  { value: "zh", label: "中文" },
] as const

export function LanguageSelect() {
  const { i18n, t } = useTranslation()
  const currentLanguage =
    languages.find(
      (language) => language.value === (i18n.resolvedLanguage ?? i18n.language)
    ) ?? languages[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
          />
        }
        aria-label={t("app.language")}
      >
        <Languages aria-hidden="true" />
        <span className="hidden sm:inline">{currentLanguage.label}</span>
        <ChevronDown aria-hidden="true" className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuRadioGroup
          value={currentLanguage.value}
          onValueChange={(value) => void i18n.changeLanguage(value)}
        >
          <DropdownMenuLabel>{t("app.language")}</DropdownMenuLabel>
          {languages.map((language) => (
            <DropdownMenuRadioItem key={language.value} value={language.value}>
              {language.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
