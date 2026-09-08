import { useEffect } from "react"
import { useTranslation } from "react-i18next"

type TranslationState = {
  source: string
  rendered: string
}

const textState = new WeakMap<Text, TranslationState>()
const attributeState = new WeakMap<Element, Map<string, TranslationState>>()
const translatedAttributes = ["aria-label", "alt", "placeholder", "title"]

function spacing(value: string) {
  return {
    before: value.match(/^\s*/)?.[0] ?? "",
    after: value.match(/\s*$/)?.[0] ?? "",
  }
}

/**
 * Localizes legacy page copy that predates the i18next integration. Keeping the
 * English phrase as the lookup key lets content-heavy pages opt into translation
 * without coupling their layout to translation-specific data structures.
 */
export function DocumentTranslations() {
  const { i18n } = useTranslation()

  useEffect(() => {
    const translations = (i18n.getResource(
      i18n.resolvedLanguage ?? i18n.language,
      "translation",
      "content"
    ) ?? {}) as Record<string, string>
    const templates = (i18n.getResource(
      i18n.resolvedLanguage ?? i18n.language,
      "translation",
      "dynamic"
    ) ?? {}) as Record<string, string>

    const interpolate = (
      template: string | undefined,
      values: Record<string, string>
    ) => {
      if (!template) return undefined
      return Object.entries(values).reduce(
        (result, [key, value]) => result.replaceAll(`{{${key}}}`, value),
        template
      )
    }

    const translate = (source: string) => {
      if (translations[source]) return translations[source]

      let match = source.match(/^Decrease (.+) quantity$/)
      if (match)
        return (
          interpolate(templates.decreaseQuantity, { name: match[1] }) ?? source
        )
      match = source.match(/^Increase (.+) quantity$/)
      if (match)
        return (
          interpolate(templates.increaseQuantity, { name: match[1] }) ?? source
        )
      match = source.match(/^Remove (.+)$/)
      if (match)
        return interpolate(templates.remove, { name: match[1] }) ?? source
      match = source.match(/^(.+) image unavailable$/)
      if (match)
        return (
          interpolate(templates.imageUnavailable, { name: match[1] }) ?? source
        )
      match = source.match(/^(.+) image$/)
      if (match)
        return interpolate(templates.image, { name: match[1] }) ?? source
      match = source.match(/^(.+) video$/)
      if (match)
        return interpolate(templates.video, { name: match[1] }) ?? source
      match = source.match(/^Added \((\d+)\)$/)
      if (match)
        return interpolate(templates.added, { count: match[1] }) ?? source
      match = source.match(/^View full poster: (.+)$/)
      if (match) {
        return (
          interpolate(templates.viewPoster, {
            title: translations[match[1]] ?? match[1],
          }) ?? source
        )
      }
      match = source.match(/^(.+) is required$/)
      if (match)
        return (
          interpolate(templates.required, {
            field: translations[match[1]] ?? match[1],
          }) ?? source
        )
      match = source.match(/^Select at least one (.+)$/)
      if (match)
        return (
          interpolate(templates.selectOne, {
            field: translations[match[1]] ?? match[1],
          }) ?? source
        )
      match = source.match(/^(.+) must be greater than 0$/)
      if (match)
        return (
          interpolate(templates.greaterThanZero, {
            field: translations[match[1]] ?? match[1],
          }) ?? source
        )

      return source
    }

    const translateText = (node: Text) => {
      const current = node.nodeValue ?? ""
      const previous = textState.get(node)
      const sourceValue =
        previous && current === previous.rendered ? previous.source : current
      const source = sourceValue.trim().replace(/\s+/g, " ")
      if (!source) return

      const translated = translate(source)
      const { before, after } = spacing(sourceValue)
      const rendered = `${before}${translated}${after}`
      textState.set(node, { source: sourceValue, rendered })
      if (current !== rendered) node.nodeValue = rendered
    }

    const translateElement = (element: Element) => {
      const states = attributeState.get(element) ?? new Map()
      for (const attribute of translatedAttributes) {
        const current = element.getAttribute(attribute)
        if (!current) continue
        const previous = states.get(attribute)
        const source =
          previous && current === previous.rendered ? previous.source : current
        const rendered = translate(source)
        states.set(attribute, { source, rendered })
        if (current !== rendered) element.setAttribute(attribute, rendered)
      }
      attributeState.set(element, states)
    }

    const translateTree = (root: Node) => {
      if (root instanceof Text) {
        translateText(root)
        return
      }
      if (!(root instanceof Element) && !(root instanceof Document)) return
      if (root instanceof Element) translateElement(root)
      const walker = document.createTreeWalker(
        root,
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
      )
      let node = walker.nextNode()
      while (node) {
        if (node instanceof Text) translateText(node)
        else if (node instanceof Element) translateElement(node)
        node = walker.nextNode()
      }
    }

    translateTree(document.body)
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") translateTree(mutation.target)
        for (const node of mutation.addedNodes) translateTree(node)
      }
    })
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
    })
    document.documentElement.lang = i18n.resolvedLanguage ?? i18n.language

    return () => observer.disconnect()
  }, [i18n, i18n.resolvedLanguage])

  return null
}
