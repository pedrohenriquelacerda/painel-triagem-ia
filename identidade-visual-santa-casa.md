# Identidade Visual — Santa Casa de Porto Alegre

Guia de referência para que projetos (design, web, materiais de comunicação) sigam o manual de marca da Santa Casa. Todos os valores abaixo são extraídos do manual oficial e devem ser seguidos expressamente.

---

## 1. Paleta de Cores

A **cor principal** comunica a marca. As **cores secundárias** dão apoio ao desenvolvimento de todo e qualquer material de comunicação.

### Cor Principal

| Nome | Pantone | CMYK | RGB | HEX |
|------|---------|------|-----|-----|
| Azul Santa Casa | PANTONE 286 | C100 M72 Y0 K0 | R0 G77 B157 | `#004D9D` |

### Cores Secundárias

| Nome | Pantone | CMYK | RGB | HEX |
|------|---------|------|-----|-----|
| Azul Escuro | PANTONE 288 | C100 M80 Y10 K30 | R7 G55 B114 | `#073772` |
| Azul Médio | PANTONE 285 | C90 M48 Y0 K0 | R0 G133 B185 | `#0071B9` |
| Azul Profundo | PANTONE 289 | C100 M76 Y10 K65 | R6 G32 B71 | `#062047` |

> Observação: para impressão use sempre as referências **Pantone/CMYK**; para telas (web, vídeo, apps) use **RGB/HEX**.

### Tokens para projetos web (CSS)

```css
:root {
  /* Cor principal */
  --santa-casa-azul:          #004D9D; /* PANTONE 286 */

  /* Cores secundárias */
  --santa-casa-azul-escuro:   #073772; /* PANTONE 288 */
  --santa-casa-azul-medio:    #0071B9; /* PANTONE 285 */
  --santa-casa-azul-profundo: #062047; /* PANTONE 289 */
}
```

### Tokens para Tailwind CSS

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        santacasa: {
          DEFAULT:  '#004D9D', // principal — PANTONE 286
          escuro:   '#073772', // PANTONE 288
          medio:    '#0071B9', // PANTONE 285
          profundo: '#062047', // PANTONE 289
        },
      },
    },
  },
};
```

---

## 2. Tipografia

A família tipográfica da Santa Casa é a **Montserrat**.

- Todas as variações podem ser utilizadas para **destaque** das peças.
- Em blocos de texto mais densos e extensos, utilize a versão **Regular**.

### Variações disponíveis

```
Thin            ThinItalic
ExtraLight      ExtraLightItalic
Light           LightItalic
Regular         Italic
Medium          MediumItalic
SemiBold        SemiBoldItalic
Bold            BoldItalic
ExtraBold       ExtraBoldItalic
Black           BlackItalic
```

### Importação (web)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

```css
:root {
  --santa-casa-fonte: 'Montserrat', sans-serif;
}

body {
  font-family: var(--santa-casa-fonte);
  font-weight: 400; /* Regular para textos corridos */
}
```

### Recomendação de uso

| Contexto | Peso sugerido |
|----------|---------------|
| Texto corrido / blocos densos | Regular (400) |
| Subtítulos / destaques leves | Medium (500) / SemiBold (600) |
| Títulos | Bold (700) / ExtraBold (800) |
| Chamadas de grande impacto | Black (900) |

---

## 3. Uso do Logotipo

### Grid construtivo

A marca é construída sobre uma malha proporcional baseada na medida **X**, com espaçamentos de **3X**. Ao redimensionar a marca, mantenha sempre essas proporções — nunca distorça, estique ou recomponha os elementos manualmente.

### Área de proteção

Corresponde à área mínima que o logotipo necessita ao seu redor para não ser confundido com outros elementos e preservar sua legibilidade. Essa margem de respiro equivale a **3X** em torno da marca.

- Nenhum elemento gráfico, texto ou imagem deve invadir essa área.
- Mantenha a área de proteção em todas as aplicações, independentemente do tamanho.

### Redução máxima

A marca **não deve ser reproduzida em tamanho menor** do que o indicado no manual. Esse cuidado garante a legibilidade.

| Aplicação | Tamanho mínimo |
|-----------|----------------|
| Versão completa | **3,1 cm** |
| Versão reduzida | **1,9 cm** |

---

## 4. Checklist rápido para projetos

- [ ] A cor principal usada é `#004D9D` (PANTONE 286)?
- [ ] As cores aplicadas pertencem à paleta oficial?
- [ ] A fonte é Montserrat, com Regular nos textos longos?
- [ ] O logotipo mantém suas proporções originais (sem distorção)?
- [ ] A área de proteção (3X) ao redor da marca foi respeitada?
- [ ] A marca está acima do tamanho mínimo (3,1 cm / 1,9 cm)?
- [ ] Em impressão, foram usadas as referências Pantone/CMYK?

---

*Documento de referência baseado no Manual de Identidade Visual da Santa Casa de Porto Alegre. Em caso de dúvida, o manual oficial prevalece.*
