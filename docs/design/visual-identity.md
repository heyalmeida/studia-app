# Identidade Visual — Studia

| Campo | Valor |
|---|---|
| **Status** | Aprovado (decisão do dono em 2026-10-08) |
| **Decisão-mãe** | [ADR-0009](../adr/ADR-0009-identidade-visual-escura-com-destaque.md) — substitui o [ADR-0006](../adr/ADR-0006-identidade-visual-monocromatica.md); escrita em `StyleSheet` por [ADR-0010](../adr/ADR-0010-estilo-stylesheet-expo-go.md), que substitui o [ADR-0007](../adr/ADR-0007-estilo-nativewind.md) |
| **Fonte de tokens** | `src/constants/theme.ts` (fonte única) + `src/styles/global.css` (CSS variables) + `tailwind.config.js` |

> **Direção:** escuro profundo, minimalista e premium (referências de layout: **Linear** e **Things**).
> A hierarquia vem de tipografia, espaço, tom de superfície e hairline. Há **uma** cor de destaque
> (índigo) e três semânticas. Sem sombras. Tema **único** (escuro): o app não alterna para claro.

## 1. Tokens de cor

Fonte única: `src/constants/theme.ts` (TypeScript — é de lá que sai **todo** o estilo, já que o
componente escreve `StyleSheet`, ADR-0010) espelhada em `src/styles/global.css` (CSS variables) e
`tailwind.config.js`.

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0B0B0F` | fundo de tela |
| `surface` | `#15151B` | cards, linhas, tab bar, badges |
| `surface-raised` | `#1C1C24` | campo de texto, chip não selecionado, bloco de data, trilhos de progresso |
| `border` | `#23232C` | hairline de card e separador de lista |
| `text` | `#F5F5F7` | texto primário |
| `text-secondary` | `#A1A1AA` | apoio, metadados |
| `text-tertiary` | `#6B6B76` | legendas, **placeholder**, item inativo da tab bar, ícone de estado vazio |
| `accent` | `#6366F1` | ação principal, item ativo da tab bar, foco de input, chip selecionado, progresso |
| `accent-soft` | `rgba(99,102,241,.16)` | fundo de seleção (chip, dia do calendário) |
| `on-accent` | `#FFFFFF` | texto/ícone sobre o destaque |
| `success` | `#34D399` | concluído |
| `warning` | `#FBBF24` | prazo hoje/amanhã |
| `danger` | `#F87171` | vencido, erro de campo, exclusão |

**Regra (ADR-0007 + Regra 4.10):** componente estiliza com `className` usando esses tokens. Literal de
hex fora dos três arquivos acima é proibido; quando o valor é calculado em runtime (cor da matéria) ele
vem do tema, nunca de um `#...` na árvore de componentes.

### Contraste (fundo `#0B0B0F`)

| Combinação | Razão | Uso |
|---|---|---|
| `text` sobre `background` | ≈ 18:1 | títulos, valores |
| `text-secondary` sobre `surface` | ≈ 8:1 | apoio, listas |
| `text-tertiary` sobre `surface` | ≈ 4.6:1 | legendas, placeholder, separadores de texto |
| `on-accent` sobre `accent` | ≈ 4.6:1 | rótulo do botão principal e da FAB |

### Paleta de matérias (8 tons)

| Nome | `value` | `soft` (fundo tingido) |
|---|---|---|
| Índigo | `#6366F1` | `rgba(99, 102, 241, 0.18)` |
| Violeta | `#8B5CF6` | `rgba(139, 92, 246, 0.18)` |
| Rosa | `#EC4899` | `rgba(236, 72, 153, 0.18)` |
| Laranja | `#F97316` | `rgba(249, 115, 22, 0.18)` |
| Âmbar | `#EAB308` | `rgba(234, 179, 8, 0.18)` |
| Verde | `#22C55E` | `rgba(34, 197, 94, 0.18)` |
| Ciano | `#06B6D4` | `rgba(6, 182, 212, 0.18)` |
| Coral | `#F43F5E` | `rgba(244, 63, 94, 0.18)` |

Única fonte válida para `Subject.color` (`SUBJECT_COLOR_NAMES` na validação de domínio;
`migrateSubjects` normaliza qualquer outro valor para `null` na leitura do storage). A cor aparece no
quadrado do ícone do card de matéria, na bolinha da lista de atividades/avaliações e na barra de
progresso da matéria. Matéria sem cor (registro antigo) usa o neutro — nunca um tom inventado.

## 2. Tipografia

Sistema do próprio dispositivo (sem dependência de fontes). **No máximo 3 pesos: 400, 600, 700.**

| Token | Tamanho | Peso | Uso |
|---|---|---|---|
| `title` | 28 | 700 | nome da tela (header) |
| `cardTitle` | 17 | 600 | título de card, título de item em destaque |
| `body` / `bodyStrong` | 15 | 400 / 600 | conteúdo e ênfase |
| `legend` | 12 | 600 · letterSpacing 0.4 | rótulos de formulário, legendas, chips, separadores de seção |
| `metric` / `day` | 22 / 26 | 700 | percentual do anel, dia do bloco de data |

Hierarquia de estados — **cor nunca sozinha** (o texto sempre diz o mesmo que a cor):

| Estado | Tratamento |
|---|---|
| Prazo hoje/amanhã | chip `warning` + rótulo "hoje"/"amanhã" |
| Prazo vencido | chip `danger` + rótulo "atrasada N dias" |
| Prazo com folga | chip `neutral` + rótulo "em 12 dias" |
| Concluída / realizada | `text-tertiary` + tracejado + checkbox preenchido no destaque |
| Erro de campo / exclusão | `danger` |

## 3. Espaçamento, raio, traço

- Escala de 4: **4, 8, 12, 16, 24, 32**; **padding lateral de tela 20**; gap entre cards 12–16;
  20 entre grupos de formulário; 8 entre rótulo e campo.
- **Raio:** card 16, campo/botão 12, chip/bloco de data 12, bolinha 999.
- **Hairline:** `border` de 1 px e `StyleSheet.hairlineWidth` nos separadores de lista.
- **Sem sombra** (RNF-01): profundidade = tom de superfície + hairline. **Exceção única:** o botão de
  criação (círculo no centro da tab bar) usa `elevation: 6` preto, por ser o único elemento elevado
  sobre o conteúdo (ADR-0010 §3). Nenhuma outra superfície usa sombra.
- **Alvo de toque mínimo 44×44** em todo pressable; feedback de escala 0.97 + opacidade (primitivo
  `Touchable`), e 0.9–0.92 em alvos pequenos (ícone do header, checkbox).

## 4. Composição das telas

- **Header (`ScreenHeader`):** título à esquerda, ações à direita **na mesma linha** (ícone 20 px, sem
  círculo de fundo, alvo 44). A criação de item aparece **também** aqui, em texto com ícone `Plus`
  (`CreateButton`) — o mesmo destino do botão central da tab bar.
- **Botão de criação:** círculo de 56 na cor de destaque, **no centro da tab bar** (desde
  2026-10-09 — substitui a FAB flutuante do canto). O destino depende da aba ativa (Painel/Matérias →
  matéria; Atividades → atividade; Avaliações → avaliação). Listas usam `contentBottomInset(insets.bottom)`
  para o conteúdo não ficar sob a barra.
- **Cards:** 1 item por card em matérias e avaliações; listas de atividade usam linha única com
  separador hairline (padrão iOS settings / Linear).
- **Estado vazio:** ícone lucide 40 px em `text-tertiary`, título, **uma** frase de apoio e botão
  primário — centralizado.
- **Formulário:** rótulo 12 px (`legend`) 8 px acima do campo; rodapé fixo com Salvar (destaque),
  Excluir (texto `danger`) e Cancelar (texto neutro).
- **Data:** campo pressable (abre o calendário) + atalhos Hoje / Amanhã / Próxima semana.
- **Tab bar:** flutuante, `surface` + hairline, item **ativo** no destaque com label, inativos em
  `text-tertiary`; **2 abas à esquerda, botão de criação ao centro, 2 à direita**.

## 5. Checklist de conformidade

- [ ] Zero hex fora de `src/constants/theme.ts`, `src/styles/global.css` e `tailwind.config.js`
- [ ] `View`/`Text`/`Pressable` estilizados por `StyleSheet` com valores de `constants/theme.ts`
- [ ] Nenhum `className` em `src/` (o Expo Go não aplica) — ADR-0010 §1
- [ ] Estados sempre com rótulo textual junto da cor
- [ ] Contraste ≥ 4.5:1 nos pares listados em §1
- [ ] `shadow*`/`elevation` apenas no botão de criação da tab bar (exceção do ADR-0010 §3)
- [ ] Nenhum alvo tocável abaixo de 44×44
- [ ] `Subject.color` sempre vindo de `SUBJECT_COLORS`