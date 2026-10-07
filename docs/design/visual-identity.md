# Identidade Visual — Studia

| Campo | Valor |
|---|---|
| **Status** | Aprovado (decisão do dono em 2026-10-07) |
| **Decisão-mãe** | [ADR-0006](../adr/ADR-0006-identidade-visual-monocromatica.md) · escrita em NativeWind por [ADR-0007](../adr/ADR-0007-estilo-nativewind.md) |
| **Fonte de tokens** | `tailwind.config.js` + `src/global.css` (código) — este documento é a especificação |

> **Direção:** minimalismo monocromático — preto-e-branco, e vice-versa no tema escuro. A hierarquia é
> construída **apenas** com tipografia, peso, espaço, borda e preenchimento. Nenhuma cor saturada em lugar
> algum. Sem sombras.

## 1. Tokens de cor (estritamente cinza)

Baseados no `Colors` do scaffold, estendidos. Light ↔ Dark são **o espelho um do outro** (preto e branco
invertidos + mesmo par de neutros).

```ts
// src/constants/theme.ts — valores a implementar no Slice 0
export const Colors = {
  light: {
    text:            '#000000',   // título, valor, ação primária
    textSecondary:   '#60646C',   // apoio, metadados, placeholder
    textTertiary:    '#8A8F98',   // legendas micro, contadores
    background:      '#FFFFFF',
    backgroundElement:'#F4F4F6',  // superfície de card/lista, chips
    backgroundSelected:'#E7E7EB', // pressed/selected
    border:          '#E0E0E5',   // hairline padrão
    borderStrong:    '#000000',   // borda de destaque (estados sem cor)
    surfaceInverse:  '#000000',   // fundo de badge preenchido / botão primário
    textOnInverse:   '#FFFFFF',
  },
  dark: {
    text:            '#FFFFFF',
    textSecondary:   '#B0B4BA',
    textTertiary:    '#7D828B',
    background:      '#000000',
    backgroundElement:'#1C1D21',
    backgroundSelected:'#2A2C31',
    border:          '#2A2A2E',
    borderStrong:    '#FFFFFF',
    surfaceInverse:  '#FFFFFF',
    textOnInverse:   '#000000',
  },
} as const;
```

Os valores acima vivem em `src/global.css` como CSS variables (`--color-*`) com bloco
`@media (prefers-color-scheme: dark)`, e são expostos ao Tailwind em `tailwind.config.js` como
`text`, `text-secondary`, `text-tertiary`, `background`, `surface`, `surface-selected`, `border`,
`border-strong`, `inverse`, `on-inverse`.

**Regra (ADR-0007):** componente estiliza com `className` usando esses tokens — ex.:
`text-text`, `bg-surface`, `border-border-strong`. Proibido `#hex` literal fora de `global.css` e
proibido classes arbitrárias `bg-[#...]`/`text-[#...]`.

## 2. Tipografia

Sistema do próprio dispositivo (sem dependência de fontes). Escala fixa:

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `title` | 28 | 700 | nome da tela (header) |
| `section` | 12 | 600 · **UPPERCASE** · letterSpacing 1.2 | rótulos de seção e micro-legendas |
| `body` | 16 | 400 | conteúdo padrão |
| `bodyStrong` | 16 | 600 | item ativo, valor emphasis |
| `meta` | 13 | 400 | datas, contadores, apoio |
| `button` | 16 | 600 | rótulos de ação |

Hierarquia de **estados sem cor** (substitui vermelho/verde):

| Estado | Tratamento |
|---|---|
| Prazo vencendo em ≤2 dias | rótulo `HOJE`/`amanhã` em `bodyStrong` + badge outline (`borderStrong` 1px, raio 6) |
| Atrasada | badge **inversão** (`surfaceInverse` preenchido, texto `textOnInverse`) com rótulo "ATRASADA" |
| Concluída / realizada | texto `textTertiary` + **riscado** (`textDecorationLine: line-through`) |
| Pendente | padrão `body`/`bodyStrong` |
| Números do painel | grandes (34–40, peso 700) + rótulo `section` — contraste por escala, não cor |

## 3. Espaçamento, raio, traço

- Escala `Spacing` do scaffold (4/8/16/24/32) — ritmo vertical 16; respiro de tela 20 (padding lateral);
  card interno 16; gap entre itens 12.
- `radius`: card/lista **14**; campo de formulário **10**; chip/badge **6**; botão **12**; monograma **10** (quadrado arredondado).
- `hairline` = `StyleSheet.hairlineWidth` para divisores de lista e bordas de card; `borderStrong` só em
  foco/estado — nada de bordas grossas decorativas.
- **Profundidade sem sombra:** card = `backgroundElement`; fundo da tela = `background`; separação só por
  tonalidade + hairline.
- Monograma: quadrado 40×40 (32 nas listas), `borderStrong` 1px, texto peso 700, centrado.

## 4. Composição das telas (densidade minimalista)

- Header por aba: só título (`title`) + botão de ação quando existir; sem subtitle; sem ícones decorativos.
- Listas: linha única por item (título + meta na 2ª linha), hairline entre itens, sem card por item quando
  a lista já é a superfície (padrão iOS settings / Linear).
- FAB/substituo: **sem FAB** — ação de criação no canto direito do header como texto "+ Nova matéria"
  (padrão minimalista: ação por texto, não por botão flutuante).
- Modais de formulário: apresentadas como sheet/push com `title` curto ("Nova matéria"), campos empilhados,
  botão primário full-width preenchido (`surfaceInverse`) + secundário texto simples.
- Empty state: título `bodyStrong` + parágrafo `meta` + nada mais; sem ilustração, sem emoji na UI.
- Navegação por abas: labels de texto apenas (ícones do scaffold podem permanecer monocromáticos se já
  forem; trocar para texto se houver qualquer asset colorido).

## 5. Monograma de matéria (decisão ADR-0006)

Derivado, **nunca armazenado**:

```
monograma("Cálculo I")            → "CI"
monograma("Algoritmos e Estruturas") → "AE"   // palavras significativas
monograma("Introdução à Banco de Dados") → "IB" // ignora conectivos de/da/do/e/à/a/o; pega as 2 primeiras
monograma("Física")               → "F"
```

Implementação: `monograma(name: string): string` em `src/domain/monogram.ts`, pura e testável.

## 6. Referências de pesquisa (Mobbin)

O MCP `Mobbin` (`https://api.mobbin.com/mcp`) está configurado no ambiente. Termos de busca que sustentam
esta direção (usar para ajustar densidade/layout, **nunca para importar cor**):

- `minimalist to-do app`, `monochrome productivity app`, `black and white UI`
- Apps-âncora de padrão: **Things 3** (listas de linha única + header de texto), **Linear** (micro-labels
  UPPERCASE + hairlines), **Notion mobile** (superfície tonal sem sombra), **Blank Space / Stoic**
  (tipografia grande monocromática), **Streaks** (alternância de situação sem cor).

**Como usar na sessão de implementação:** se a ferramenta Mobbin estiver disponível, o agente de pesquisa
deve extrair 2–3 referências de **estrutura de lista, header de tela e formulário modal** e registrar as
observações em `docs/design/references.md` (criar ao usar). Os prompts de implementação (execution-prompts)
já embutem as regras destiladas acima — o implementador **não depende** da pesquisa para produzir o layout.

## 7. Checklist de conformidade (para review/verificação)

- [ ] Zero hex fora de `src/global.css` e `tailwind.config.js` (proibido `bg-[#...]`/`text-[#...]`)
- [ ] `Text`/`View` estilizados por `className` com tokens do tema (ADR-0007)
- [ ] Estados (atrasada/concluída/erro) legíveis em **escala de cinza** imprimível
- [ ] Contraste texto/fundo ≥ 4.5:1 nos dois temas
- [ ] Nenhum `shadow*` em StyleSheet
- [ ] Monograma renderizado de função derivada, ausente do storage
