# HexaSort Party v2 — Art Bible (Dirección Artística Definitiva)

> **Dirección aprobada por el dueño:** #1 **NEÓN OSCURO** (estilo Hex FRVR dark)
> **Nivel de calidad objetivo:** Comercial
> **Fuente de verdad:** `referencias/reporte.md` (15 referencias reales, paleta, fuentes y assets verificados)
> **Estado:** ✅ Definitiva — v2.0 — 17/08/2026
> **Ámbito de aplicación:** mockup HTML, prototipo, y build final (web/móvil)

---

## 1. Identidad

| Atributo | Valor |
|---|---|
| **Mood** | Neón nocturno minimalista — el tablero flotando en la oscuridad |
| **Referencia primaria** | Hex FRVR dark (`07_hex-frvr_tablero_hex_dark.png`) |
| **Frase de diseño** | *"El tablero es la estrella, el HUD no le roba luz."* |
| **Forma reina** | El hexágono. No hay cuadrados. No hay marcos dorados. No hay escenas narrativas. |
| **Cómo se siente** | Fondo azul-negro profundo, piezas pastel neón que brillan, merges que encienden el tablero como luces de ciudad de noche |
| **Por qué funciona** | El fondo oscuro hace que las cascadas y el modo multijugador (2-4 jugadores, tablero compartido de 19 hex, layout 3-4-5-4-3) destaquen; menos fatiga visual en sesiones largas |

**Regla de oro:** cada pieza de UI debe preguntarse *"¿le estoy restando luz al tablero?"*. Si la respuesta es sí, se rediseña.

---

## 2. Paleta de color (EXACTA)

> Los hex marcados **"reporte"** están copiados textualmente de la Dirección 1 del reporte. Los marcados **"extendido"** derivan de la misma dirección (mismo tono, misma familia) para cubrir roles que el juego necesita. **No se permite aproximar ni re-tonalizar los valores.**

### 2.1 Roles → Hex (obligatorio)

| Rol | Función | Hex | Origen |
|---|---|---|---|
| **Fondo** | Fondo general de pantalla | `#0B0F1A` | reporte |
| **Superficie** | Hexágonos vacíos del tablero / panel base | `#1E2433` | reporte |
| **Superficie elevada** | Hex con hover/preview, tarjetas elevadas, pool | `#2A3347` | extendido |
| **Líneas / bordes** | Bordes de hex vacíos, separadores, outlines sutiles | `#36405A` | extendido |
| **Pieza color 1** | Pila rosa (pilas del juego) | `#FF5C8A` | reporte |
| **Pieza color 2** | Pila menta (pilas del juego) | `#4DE3C1` | reporte |
| **Pieza color 3** | Pila violeta (pilas del juego) | `#A78BFA` | extendido |
| **Acento CTA** | Botón principal ("Colocar", "Jugar", "Continuar") | `#4CC9F0` | extendido |
| **Éxito** | Merge, puntos, recompensa, glow dorado | `#FFD166` | reporte |
| **Peligro** | Penalización −5, imposibilidad de movimiento, derrota | `#FF4D4F` | extendido |
| **Texto primario** | Títulos, números de pila, puntuación | `#F4F6FB` | reporte |
| **Texto secundario** | Subtítulos, ayudas, marcas de turno pasivo | `#9AA3B5` | extendido |

**Tokens CSS (usar estos, nunca hex sueltos):**

```css
:root {
  --fondo:              #0B0F1A;
  --superficie:         #1E2433;
  --superficie-elevada: #2A3347;
  --borde:              #36405A;
  --pieza-1:            #FF5C8A;  /* rosa  */
  --pieza-2:            #4DE3C1;  /* menta */
  --pieza-3:            #A78BFA;  /* violeta */
  --cta:                #4CC9F0;  /* cian */
  --exito:              #FFD166;  /* dorado */
  --peligro:            #FF4D4F;
  --texto-primario:     #F4F6FB;
  --texto-secundario:   #9AA3B5;
  --tinta:              #0B0F1A;  /* texto oscuro sobre piezas/acentos claros */
}
```

### 2.2 Tokens de jugador (turno, extendido)

El anillo/nombre de turno usa tokens propios para que el jugador activo se lea de un vistazo. **El anillo + el nombre distinguen al jugador, no el relleno** (las piezas son compartidas).

| Jugador | Token | Hex |
|---|---|---|
| Jugador 1 | Cian | `#4CC9F0` |
| Jugador 2 | Dorado | `#FFD166` |
| Jugador 3 | Naranja | `#FF8F4C` |
| Jugador 4 | Rosa | `#FF5C8A` |

### 2.3 Proporción 60 / 30 / 10

| Bloque | % | Color |
|---|---|---|
| **60%** — Base oscura | Fondo + superficies (`#0B0F1A`, `#1E2433`) | El tablero y los vacíos dominan la pantalla |
| **30%** — Piezas y juego | Las 3 piezas + superficie elevada | Los colores de juego son la segunda capa |
| **10%** — Acentos funcionales | CTA, éxito, peligro, texto | Glow dorado, botones, errores, números: escasos y legibles |

### 2.4 Contraste de texto (≥ 4.5:1 verificado)

| Par | Ratio | Veredicto |
|---|---|---|
| Texto primario sobre fondo | ≈ 17.7:1 | ✅ |
| Texto primario sobre superficie | ≈ 14.3:1 | ✅ |
| Texto secundario sobre fondo | ≈ 7.5:1 | ✅ |
| Texto secundario sobre superficie | ≈ 6.1:1 | ✅ |
| Tinta (`#0B0F1A`) sobre pieza rosa | ≈ 6.5:1 | ✅ |
| Tinta sobre pieza menta | ≈ 11.9:1 | ✅ |
| Tinta sobre pieza violeta | ≈ 7.0:1 | ✅ |
| Tinta sobre CTA cian | ≈ 9.9:1 | ✅ |
| Tinta sobre éxito dorado | ≈ 13.3:1 | ✅ |
| Tinta sobre peligro | ≈ 5.9:1 | ✅ |

**Regla de contraste:** texto sobre fondos oscuros → claro (`#F4F6FB` / `#9AA3B5`). Texto sobre piezas, CTA, éxito o peligro (superficies luminosas) → tinta oscura `#0B0F1A`. **Nunca** blanco sobre dorado/cian/verde claro.

---

## 3. Tipografía

| Uso | Fuente | Peso | Licencia |
|---|---|---|---|
| Títulos, números de pila, puntuación grande | **Baloo 2** | 700–800 | SIL OFL 1.1 ✅ |
| UI, cuerpo, botones, tutorial | **Nunito** | 400–800 | SIL OFL 1.1 ✅ |

Ambas son de Google Fonts bajo **SIL Open Font License 1.1** — uso comercial permitido sin atribución (verificado en `reporte.md` §3).

### 3.1 Carga en HTML (obligatorio)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
```

### 3.2 Jerarquía tipográfica

| Nivel | Fuente | Tamaño (móvil) | Notas |
|---|---|---|---|
| Banner de evento (victoria/penalización) | Baloo 2 800 | 2.2em | En mayúsculas tipo display, sin expansión de letra |
| Puntuación / turno | Baloo 2 700 | 1.2–1.5em | Números siempre tabulares |
| Número dentro de la pila | Baloo 2 800 | 1.4em | Tinta `#0B0F1A` sobre la pieza |
| Cuerpo / instrucciones | Nunito 600 | 1em | Máx 2 líneas de ayuda |
| Microetiquetas | Nunito 700 | 0.75em | Mayúsculas espaciadas 0.08em, color secundario |

---

## 4. Personalidad de animación

> La sensación objetivo: **rápida de entender, jugosa de sentir**. Material-style: suave, con inercia, nunca elástica de más.

- **Easing principal:** `cubic-bezier(.4, 0, .2, 1)` (token CSS `--ease-snappy`). Todas las animaciones usan este easing salvo excepción explícita.
- **Micro-interacciones (150ms):** hover/click de pila, botones y hex. Click: `scale(0.95)` → al soltar `scale(1)`. Hover: `scale(1.06)` + glow sutil del color.
- **Merge (800–1200ms):** los dots de la pila fuente **se deslizan uno a uno** source → target (traducción con curva), mientras el hex target **pulsa** `scale(1) → 1.15 → 1` y emite un **glow** del color de la pieza que se expande y se desvanece (800ms).
- **Cascada (stagger 50ms):** cada eslabón de la cadena arranca con **50ms de retardo** respecto al anterior. El glow dorado `#FFD166` recorre la cadena eslabón a eslabón.
- **Desaparición (≥10 hex):** explosión de **12–24 partículas hexagonales** del color de la pieza + **screen shake 300ms ±3px** + flash dorado radial. Es el único momento con shake completo.
- **Score popup:** el número de puntos escala-in desde `scale(0.3)` hasta `2.2em` con overshoot leve (300ms) y se desvanece hacia arriba.
- **Confetti: SOLO en victoria.** Ningún otro evento usa confetti (mantiene la recompensa final especial).

| Evento | Duración | Notas |
|---|---|---|
| Hover / click | 150ms | `scale` únicamente |
| Colocar pila | 250–350ms | vuelo pool→hex + squash al aterrizar |
| Merge | 800–1200ms | dots deslizantes + glow del target |
| Stagger por eslabón de cascada | 50ms | entre eslabones |
| Desaparición ≥10 | 300–600ms | partículas + shake 300ms ±3px |
| Cambio de turno | 300–400ms | barrido del anillo de turno |
| Penalización −5 | 400–500ms | flash rojo + shake leve 150ms ±2px |
| Victoria | 800–1200ms | banner + confetti (único) |

**Implementación:** animar **solo `transform` y `opacity`** (acelerados por GPU). Nunca `top/left/width/height`.

---

## 5. Feedback por acción (TABLA OBLIGATORIA — implementar TODAS)

| # | Acción del jugador | Respuesta visual | Timing | Colores (hex) | Audio (evento) |
|---|---|---|---|---|---|
| 1 | **Seleccionar pila del pool** | La pila escala `1 → 1.08` + glow del color de la pila; contador del turno se ilumina en el token del jugador activo | 150ms | glow del color de la pila + token jugador | Kenney UI click |
| 2 | **Hover hex vacío** (en táctil: primer toque = preview) | El hex vacío se eleva a superficie elevada + contorno en el color de la pila seleccionada | 100ms | fill `#2A3347`, borde del color de pila | Kenney UI hover |
| 3 | **Colocar pila** | La pila vuela del pool al hex (translate + scale), squash `0.9` al aterrizar → `1`, glow del color 200ms; el hueco del pool queda vacío sombreado | 250–350ms | pieza + glow del color de pila | Freesound 178474 (Bang, Pop) |
| 4 | **Merge (adyacencia mismo color)** | Dots deslizantes source→target (uno por nivel), target pulsa `1 → 1.15 → 1`, glow dorado que expande, contador del target +1 | 800–1200ms | glow `#FFD166` + color de pieza | Freesound 202230 (merge individual) |
| 5 | **Cascada (merge en cadena)** | Cada eslabón arranca con stagger 50ms; los dots recorren la cadena; el glow dorado tiñe el eslabón activo | por eslabón 800–1200ms + 50ms stagger | `#FFD166` recorriendo la cadena | Freesound 199924 (pops en cadena) |
| 6 | **Desaparición (≥10 hex)** | Explosión de 12–24 partículas hexagonales del color + screen shake 300ms ±3px + flash dorado radial; los hex desaparecen con fade | 300–600ms | partículas del color pieza + `#FFD166` | Freesound 245646 (Cartoon Pop Distorted) |
| 7 | **Cambio de turno** | El anillo de turno se desliza/atraviesa al siguiente token de jugador (borde glow); aviso "Turno de X" slide-in; jugador activo con token iluminado, pasivos atenuados | 300–400ms | token del jugador nuevo turno; pasivos `#9AA3B5` | Kenney UI confirm |
| 8 | **Penalización (−5)** | "−5" flota subiendo en rojo; la superficie del tablero parpadea rojo 2 veces; shake leve 150ms ±2px; sin confetti | 400–500ms | `#FF4D4F` | Kenney UI cancelar |
| 9 | **Victoria** | Banner "¡Victoria!" scale-in (Baloo 2 800, 2.2em), destello dorado de borde, **confetti multicolor (único evento)** | 800–1200ms | `#FFD166` + confetti con las 3 piezas + CTA | Coin Sounds + Freesound 245646 |
| 10 | **Derrota / sin movimientos** | El tablero se atenúa (brillo −20% + overlay oscuro `rgba(11,15,26,.6)`), banner "Derrota" fade-in en rojo; sin confetti; botón "Reintentar" con CTA | 600–900ms | `#FF4D4F` + texto `#9AA3B5` | Kenney UI cancelar |

> La fila 6 (≥10 hex) es el **punto de climax** del juego: es la única con explosión + shake completo + sonido fuerte. Todo lo demás es contenido.

---

## 6. Jerarquía de pantalla

```
┌─────────────────────────────────────────────┐
│  HUD compacto (arriba)  ~12–15% altura      │  turno, puntuaciones, penalizaciones, −5
│  - una fila, sin branding                    │
├─────────────────────────────────────────────┤
│                                             │
│          TABLERO  ≥60% del viewport         │  19 hex (3-4-5-4-3), centrado,
│        (la estrella; nada lo tapa)          │  con glow ambiente sutil del tablero
│                                             │
├─────────────────────────────────────────────┤
│  POOL de 3 pilas (abajo)  ~18–22%           │  pilas flotantes + pilas descartadas
└─────────────────────────────────────────────┘
```

| Zona | Regla |
|---|---|
| Tablero | **≥60% del viewport** (alto; en landscape, ≥60% del ancho disponible). Nunca cubierto por modales durante el juego. |
| HUD | Compacto, arriba, una fila en móvil: turno (token + nombre), puntuaciones, contador de penalizaciones. **Sin logo ni branding durante el juego** (solo en menú). |
| Pool | Abajo, centrado, 3 pilas con tamaño táctil grande. El orden y color de las pilas es información crítica — siempre visible. |
| Modales | Victoria/derrota únicamente; fondo oscurecido ≤40%; no bloquean más tiempo del necesario. |

---

## 7. Reglas de ejecución para agentes (mockup y juego real)

**Checklist obligatorio — si no cumple, no se entrega:**

1. **Paleta:** usar los hex EXACTOS de §2.1. Prohibido aproximar, re-tonalizar o inventar colores. Definir los tokens CSS una vez y referenciarlos siempre.
2. **Feedback:** implementar TODAS las acciones de la tabla §5 con sus timings y colores. Una acción sin respuesta visual = bug de dirección artística.
3. **Animación:** solo `transform` + `opacity` (GPU). Prohibido animar `top/left/width/height/margin`.
4. **`will-change`:** aplicar `will-change: transform` (o `opacity`) en elementos animados persistentes: pilas, dots de merge, partículas, banner de score. Retirar con `animationend` si aplica.
5. **Touch:** targets táctiles ≥ **44px** (recomendado 48px) — pilas del pool, hex interactivos, botones. Área táctil puede exceder el área visual.
6. **Responsive:** `@media (max-width: 480px)`: HUD colapsa a una fila, padding del pool se reduce, el tablero se escala uniformemente con `transform: scale()` (nunca re-layout pieza a pieza). Verificar que 19 hex caben sin scroll.
7. **Audio:** usar SOLO los assets verificados del reporte (Kenney UI Audio Pack CC0; Coin Sounds CC0; pops Freesound 178474 / 199924 / 202230 / 245646 CC0, con nota del 245646: sin reentrenamiento de IA, uso en juego permitido). Etiquetar cada sonido por evento: `data-audio="click|hover|confirm|cancel|turn|place|merge|merge-big|cascade|clear|penalty|coin|win|lose"`. game-icons.net solo con atribución en créditos (CC BY 3.0).
8. **Accesibilidad:** `prefers-reduced-motion` → desactivar shake, partículas y glow continuo (mantener fades mínimos). Contraste según §2.4 (nunca texto claro sobre piezas/acentos claros). El feedback visual nunca depende solo del sonido.
9. **Glow:** usar `box-shadow`/`filter: drop-shadow` con el color de la pieza — glow excesivo blanco queda prohibido (rompe el "neón").
10. **Extras:** sombras duras `0 → 60%` opacity mínima; redondeo general 12–16px en UI; los hex del tablero se dibujan con la geometría real (6 lados), nunca rombos ni cuadrados.

---

## 8. Referencias visuales

Imágenes reales en `referencias/imagenes/` que respaldan la dirección y deben consultarse antes de implementar:

| Archivo | Juego | Qué tomar |
|---|---|---|
| `referencias/imagenes/07_hex-frvr_tablero_hex_dark.png` | Hex FRVR | **BASE DIRECTA:** geometría hexagonal, fondo oscuro, pastel mate sobre negro |
| `referencias/imagenes/08_hex-frvr_tablero_hex_light.png` | Hex FRVR | Variante clara del mismo tablero (para pruebas de contraste) |
| `referencias/imagenes/11_block-blast_tablero_efectos.png` | Block Blast | Efectos de explosión/merge sobre piezas — modelo para §5 fila 6 |
| `referencias/imagenes/12_candy-crush_tablero_hud_explosion.png` | Candy Crush | Feedback de explosión y HUD con barra/progreso (adaptado a oscuro) |
| `referencias/imagenes/09_block-blast_menu_titulo.png` | Block Blast | Tipografía display redondeada y botones planos de color sólido |
| `referencias/imagenes/10_block-blast_tablero_hud.png` | Block Blast | HUD compacto arriba, contadores legibles — modelo de §6 |
| `referencias/imagenes/04_toon-blast_tablero_dungeon.png` | Toon Blast | "Juice": esquinas redondeadas, squash, claridad de tutorial |
| `referencias/imagenes/06_toon-blast_tablero_trampas.png` | Toon Blast | Cómo se distinguen elementos interactivos vs entorno oscuro |

**Fuera de dirección (NO copiar):** marcos dorados de Royal Match (`01`–`03`), glossy caramelo de Candy Crush (`13`), escenas narrativas de Gardenscapes/Homescapes (`14`–`15`). Se estudian solo como benchmark de calidad, no como estilo.

---

## 9. Audio (assets verificados, CC0)

| Evento del juego | Asset | Licencia | Uso exacto |
|---|---|---|---|
| click / hover / confirmar / cancelar / turno | Kenney UI Audio Pack (kenney.nl/assets/ui-audio) | **CC0 1.0** | Feedback de UI §5 filas 1, 2, 7, 8, 10 |
| Pila colocada | Freesound 178474 "Bang, Pop" (DigitalDominic) | **CC0 1.0** | §5 fila 3 |
| Merge individual | Freesound 202230 "Pop sound" (deraj) | **CC0 1.0** | §5 fila 4 |
| Cascada en cadena | Freesound 199924 "Bubble Wrap Pop" (thedapperdan) | **CC0 1.0** | §5 fila 5 |
| Desaparición ≥10 / merge grande | Freesound 245646 "Cartoon Pop (Distorted)" (unfa) | **CC0 1.0** ⚠️ sin uso para entrenamiento de IA | §5 filas 6 y 9 |
| Recompensa / puntos | Coin Sounds (opengameart.org/content/coin-sounds) | **CC0 1.0** | §5 fila 9 (victoria) |

> ⚠️ **Excluido:** `opengameart.org/content/impact-sounds` (URL 404, licencia no verificable). No usar. Los pops de Freesound cubren ese rol.

---

## 10. Anti-directrices (qué NO hacer jamás)

- ❌ No introducir colores fuera de §2.1 (ni blancos puros `#FFFFFF`, ni negros puros).
- ❌ No marcos dorados, tabletas gloriosas ni ornamentos premium (eso es Royal Match, no esta dirección).
- ❌ No confetti fuera de la victoria.
- ❌ No animar el HUD constantemente — el HUD existe para callarse y dejar brillar al tablero.
- ❌ No branding durante el juego.
- ❌ No sonidos sin verificar licencia CC0/CC BY; nada de `impact-sounds` (404).
- ❌ No hex con bordes blancos brillantes; los bordes van en `#36405A`, el brillo viene del glow interno, no del contorno.