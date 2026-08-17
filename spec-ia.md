# HexaSort Party v2 — Spec Visual EXACTA (derivada de las 4 imágenes IA)

> **Fuente:** las 4 imágenes conceptuales IA aprobadas por el dueño como LOOK MAESTRO:
> `referencias/ia/01_menu.png`, `02_tablero.png`, `03_pool.png`, `04_fin.png`
> **Estado:** ✅ Contrato visual — 17/08/2026
> **Obligatorio:** el juego real debe verse EXACTAMENTE como estas imágenes. Si una regla de la art-bible contradice lo que se ve en las imágenes, **LA IMAGEN MANDA** (ver §7 Diferencias puntuales vs art-bible).
> **Compatible con:** `art-bible.md` (dirección #1 NEÓN OSCURO, Hex FRVR dark). Esta spec detalla el "cómo se ve" pixel a pixel; la art-bible detalla animación, audio y feedback.

---

## 0. Resumen ejecutivo del look (una frase por pantalla)

| Pantalla | Frase que la define |
|---|---|
| **Menú** | Un logo hexagonal dorado metálico que irradia luz desde arriba, sobre un vacío azul-negro con hexágonos neón flotantes; panel oscuro biselado con selector circular de jugadores y un gran botón JUGAR dorado. |
| **Tablero** | El tablero de 19 celdas hexagonales con borde neón azul es LA ESTRELLA; pilas de prismas hex 3D neón (rosa/verde/violeta) con lateral grueso y glow del color; HUD discreto arriba (dorado = turno), pool abajo. |
| **Pool** | Tres tarjetas oscuras con borde neón de color (rosa/dorado/violeta), cada una mostrando una torre de prismas hex 3D; la seleccionada lleva borde dorado + checkmark; gran botón play circular dorado abajo. |
| **Fin de juego** | Podium oscuro de borde puntiagudo con neón por posición (dorado=1º, magenta=2º, cyan=3º, violeta=4º), corona 3D dorada con gemas, confeti neón en barras y hexágonos; botones REPLAY (dorado), MENU (cyan), SHARE (magenta). |

---

## 1. ANÁLISIS POR PANTALLA

### 1.1 MENÚ PRINCIPAL (`01_menu.png`)

**Layout (vertical, todo centrado):**
- **Zona superior ~30% de la altura:** logo + título. El logo queda arriba del todo y el título debajo.
- **Zona central ~55%:** panel principal de interacción.
- **Zona inferior ~15%:** espacio vacío de ventilación (fondo limpio).
- **Panel central:** ~75% del ancho de pantalla × ~45% de su altura. Centrado.

**Fondo:**
- Gradiente radial: centro ligeramente más claro `#1A2035` → bordes `#050810` sobre base `#0A0D14`.
- Patrón de micro-puntos tipo estrellas/partículas lejanas en toda la pantalla (1–2px, opacidad variable, más densos cerca de los elementos luminosos).
- **Hexágonos decorativos flotantes (5–6 visibles, 2–4% del ancho cada uno):** magenta `#FF4D8A`, cyan `#00FFCC`, violeta `#8A4DFF`, amarillo `#FFD700`. Cada uno con **glow halo del color de su fill** (radio de dispersión pequeño).
- **Líneas de circuito:** curvas tenues que conectan algunos hexágonos, color teal oscuro `#1A4040`, con pulse/glow tenue.
- **Jerarquía de luz:** la luz principal emana del centro-superior (logo + título) e ilumina suavemente el panel; bordes laterales e inferiores en sombra profunda. Glow ambiente frío (azul/teal) desde el centro inferior hacia arriba.

**Paneles:**
- Rectángulo con esquinas redondeadas ~15px (≈2% del ancho del panel).
- Fill: gradiente vertical sutil `#1E2636` (arriba) → `#171D2A` (abajo).
- **Borde doble (bisel):** borde externo `#3A4559` de 2–3px; borde interno `#10141F` (efecto biselled).
- Sombra externa grande: `0 10px 40px rgba(0,0,0,0.5)` (levanta el panel del fondo).
- **Encabezado interno:** banda superior con fondo más oscuro `#111722` (sostiene los selectores de jugadores).
- **Área de nombres:** rectángulo interior `#0C1018` con borde tenue `#1E2636` (alberga los campos de texto).

**Botones:**

| Elemento | Forma | Visual exacto |
|---|---|---|
| **Selector de jugadores (2/3/4)** | Círculos perfectos, ~18% del ancho del panel cada uno | **Seleccionado:** fill gradiente dorado `#FFD080 → #F5A623`, borde amarillo intenso, texto oscuro `#2A2010`, **glow amarillo** alrededor. **No seleccionado:** fill transparente, borde azul-gris `#4A556A` 1–2px, texto `#8A95A8`, sin glow. Números bold sans, tamaño grande. |
| **JUGAR (CTA principal)** | Rectángulo de esquinas muy redondeadas ~8px; ~90% del ancho del panel × ~10% de su alto | **Gradiente vertical dorado metálico:** `#FFD700` → `#F5A623` → `#E8A618` → `#C77D12`. Borde superior claro / inferior oscuro (relieve 3D). **Glow:** `0 0 15px rgba(245,166,35,0.6)`, más intenso en la parte inferior. Texto: bold sans, marrón oscuro `#4A3510`, con sombreado interior leve (relieve). |
| **Campos de nombres** | Rectángulos con esquinas ~10px | Borde 2px `#3A608A` con brillo sutil; fill `#0D141E`. Texto sans regular `#80A0C0` ("Jugador 1", etc.). Cursor de escritura amarillo. **Campo activo = borde y glow amarillo `#FFD080` pronunciado.** |

**Título "HEXASORT PARTY":**
- Dos líneas centradas: "HEXASORT" (arriba, ~12% del alto de pantalla) y "PARTY" (debajo, ~10%).
- Fuente: **bold display sans con terminaciones redondeadas** (familia "Montserrat Black"/"Bungee"; en implementación: Baloo 2 800 — ver §3).
- Fill: gradiente vertical `#FFE566` (claro) → `#FFA500` (naranja dorado).
- Contorno exterior 2–3px `#CC6600` que define la forma.
- Drop shadow fuerte hacia abajo `#0A0A0A` + **glow naranja/dorado difuso** integrado con el resplandor general.
- Efecto global: el bloque logo+título funciona como "fuente de luz" de la pantalla.

**Logo (icono hexagonal):**
- Hexágono grande ~20% del ancho de pantalla, centrado, arriba del título.
- Fill: gradiente dorado-metálico `#FFD700 → #E8A317` con acabado brillante.
- Interior: hexágono dentro de otro hexágono con líneas de conexión (motivo "sorting/conexión").
- Borde exterior claro y reflectivo, borde interior sutil.
- **Lens flare** pequeño y brillante en la esquina superior derecha (luz incidiendo en metal).
- Glow dorado intenso circundante (se funde con el del título).

**Paleta dominante:** azules fríos oscuros + acentos dorados/amarillos calientes SOLO en los elementos interactivos clave.

---

### 1.2 TABLERO DE JUEGO (`02_tablero.png`)

**Layout (vertical ~9:16):**

| Zona | Proporción | Contenido |
|---|---|---|
| **HUD superior** | 10% alto × 100% ancho | 3 zonas: izquierda = chip de turno de jugador; centro = contador de ronda; derecha = chip de score/nombre + botones. |
| **Tablero** | 65% alto × 80% ancho, centrado | Los 19 hexágonos (layout 3-4-5-4-3 según spec del juego) formando el hexágono grande. |
| **Barra de pool** | 18% alto × 100% ancho, abajo | 3 slots de preview + controles. |

**Fondo:**
- Base: azul-negro profundo `#0A0E17`.
- **Patrón de líneas de circuito** blanco-gris tenue semitransparente sobre el fondo (más visible junto al borde del tablero).
- Gradiente radial suave (azul oscuro más claro) detrás del tablero → foco visual en el centro.
- Estrellas/partículas dispersas 1–2px (blanco/azul claro, opacidad variable).
- Viñeta azul que oscurece las esquinas y aclara hacia el centro.

**Celdas del tablero (19 hexágonos):**
- Cada celda vacía: fill azul-negro `#111824`.
- **Borde neón azul brillante `#00A8FF` de 2–3px CON GLOW** (este es el rasgo distintivo del tablero).
- Bevel interno sutil (efecto hueco/indent 3D).
- Glow global: perímetro completo del tablero con glow azul suave ~10px que se funde con el fondo.

**Pilas de piezas (prismas hexagonales 3D) — ver §4 para la fórmula completa:**

| Color | Centro (top face) | Borde/lateral oscuro | Pilas visibles en la imagen |
|---|---|---|---|
| **Rosa/rojo** | `#FF2A6D` | `#B31647` | pila de 3 (sup.), 2 (izq-media), 2 (der-media), 1 (sup. pequeña) |
| **Verde** | `#00F5A0` | `#00A876` | pila de 3 (izq.), 3 (der.) |
| **Violeta** | `#B829DD` | `#6B198E` | pila de 2 (centro-bajo), 2 (der-bajo) |

- Glow base del color de la pila (spread 5–10px).
- **Partículas flotantes diminutas (1–2px) del color de la pila** elevándose sobre las pilas de 3+.
- Drop shadow bajo cada pila: offset 5px, `rgba(0,0,0,0.2)`.
- Highlight blanco fino en la arista superior del lateral (luz de estudio cenital).

**HUD superior:**
1. **Chip de turno del jugador:** forma de **hexágono alargado con esquinas redondeadas**; fill gradiente dorado `#FFD700 → #B8860B`; texto bold oscuro estilo "PLAYER TURN" con chevrones dorados ">>>" apuntando a la derecha; contorno marrón oscuro fino. Glow dorado.
2. **Contador de ronda:** **círculo** con fill gris oscuro `#22272E` + **anillo exterior dorado grueso `#FFD700`**; texto pequeño "ROUND" (dorado, microetiqueta) sobre número grande dorado bold (p. ej. "12"). Glow dorado.
3. **Chip de score/nombre:** rectángulo redondeado, fill `#22272E`, outline azul claro fino; "SCORE:" en gris claro + valor en **blanco brillante** (p. ej. "24,500"), y nombre del jugador debajo. A la derecha: 2 botoncitos cuadrados pequeños con outline azul claro e iconos oscuros (settings/info).

**Barra de pool (inferior):**
- Rectángulo redondeado, fill `#22272E`, outline azul claro fino, ~80% del ancho, centrado abajo.
- **3 slots hexagonales** de preview; cada slot muestra UNA pieza 3D pequeña del color correspondiente, dentro de un inset circular oscuro con outline fino del color de la pieza.
- Debajo de la barra, 3 botones circulares pequeños (fill oscuro, outline azul claro): undo, vista de cuadrícula, settings.

**Efectos visuales:** glow del color por elemento; drop shadows suaves (5px, negro 20%); top faces glossy con gradiente radial (centro brillante → borde oscuro). Los merges/cascadas iluminan el tablero "como luces de ciudad de noche" (ver art-bible §4–5 para animación).

---

### 1.3 SELECCIÓN DE PILAS / POOL (`03_pool.png`)

**Layout (vertical):**

| Zona | Proporción | Contenido |
|---|---|---|
| **Top** | ~10% alto | Título "SELECT PIECES" centrado (~5% alto, 80% ancho, sans, gris claro/blanco); "LEVEL 25" arriba-derecha (misma fuente, menor); botón circular pequeño arriba-izquierda (oscuro, outline claro). |
| **Medio** | ~60% alto | **3 tarjetas de pool** en fila con espaciado (~10% ancho entre tarjetas, ~5% alto respecto al texto superior). |
| **Bottom** | ~30% alto | Botón play circular dorado, centrado. |

**Fondo:**
- Gradiente vertical `#0A0F2C` (arriba) → `#000000` (abajo), con matices azul `#1A237E` y violeta `#311B92`.
- Textura: **patrón de hexágonos tenues** (azul claro/gris ~10% de opacidad) + líneas de circuito (~5% de opacidad) → look futurista/tech.
- Partículas: destellos dorados (5–10, ~2% de tamaño) alrededor de la tarjeta seleccionada/checkmark; destellos azules tenues (3–5, ~1%) en el fondo.

**Tarjetas de pool (3, side-by-side):**
- Cada una: ~25% del ancho × ~35% del alto; rectángulo de **esquinas redondeadas ~10%**; fill azul-negro oscuro (`#0A0F2C`→negro); **borde neón 2px + glow suave (~5px blur) del color de la tarjeta**.

| Tarjeta | Borde neón | Contenido |
|---|---|---|
| **Izquierda** | Rosa `#FF6B9D` | Torre de 4 prismas hex rosa |
| **Centro (SELECCIONADA)** | **Dorado `#FFD700`** + **checkmark** | Torre de 4 prismas hex cyan; botón checkmark circular dorado (~10% ancho) en su esquina superior derecha, check negro, glow dorado |
| **Derecha** | Violeta `#9C27B0` | Torre de 2 prismas hex violeta |

**Pilas dentro de las tarjetas (prismas hex 3D):**
- Hexágonos regulares apilados verticalmente; **lateral grueso ~20% del ancho del hex** con gradiente oscuro→claro de abajo hacia arriba:

| Pila | Top face | Lateral (gradiente) |
|---|---|---|
| Rosa | `#FF6B9D` | `#4A148C` → `#FF6B9D` |
| Cyan | `#00E5FF` | `#0D47A1` → `#00E5FF` |
| Violeta | `#9C27B0` | `#4A148C` → `#CE93D8` |

- Alturas en la imagen: izquierda 4, centro 4, derecha 2 (alturas variables según el juego).
- Efecto "levantado" del fondo gracias al lateral grueso con gradiente.

**Botones:**
- **Botón play (principal):** círculo ~15% del ancho, **gradiente dorado `#FFD700 → #FFE082`**, triángulo play oscuro en el centro, **anillo dorado exterior (~10% del ancho)**, glow dorado (~5px blur).
- **Botón top-left:** círculo oscuro con outline claro (retroceso).
- **Checkmark:** círculo dorado `#FFD700`, check negro, glow dorado.

---

### 1.4 FIN DE JUEGO / VICTORIA (`04_fin.png`)

**Layout (vertical ~9:16):**

| Zona | Proporción | Contenido |
|---|---|---|
| **Top** | 0–25% alto | Título "¡FIN DEL JUEGO!" + confeti superior |
| **Medio** | 25–75% alto | Podium/panel de ranking, ~70% del ancho, centrado (15% margen por lado) |
| **Bottom** | 75–100% alto | Botones REPLAY / MENU / SHARE + confeti inferior |

**Fondo:**
- Base: azul marino profundo `#0A0E1A`.
- **Líneas de circuito** cyan/teal claras, baja opacidad (~20%), dispersas (estética tech).
- **Spotlight cálido** (blanco-amarillo, atenuación radial) sobre el centro-superior, enfocado en el panel del campeón; viñeta oscura en las esquinas.

**Panel principal (podium):**
- Oscuro semitransparente (~85% opacidad), **esquinas superiores redondeadas ~20px y fondo PUNTIAGUDO** (borde inferior en triángulo invertido, radio 0 en el pico).
- **Borde exterior fino neón cyan/azul oscuro con glow sutil.**

**Sub-paneles de ranking (4):**

| Posición | Tamaño (del podium) | Borde neón | Radio esquinas |
|---|---|---|---|
| **1º (CAMPEÓN, centro-arriba, ELEVADO)** | ~30% ancho × 30% alto | **Dorado brillante `#FFD700` + halo exterior ~5px** | 12px |
| **2º (izquierda)** | ~28% ancho × 20% alto | **Magenta/fucsia** | 10px |
| **3º (derecha)** | ~28% ancho × 20% alto | **Cyan/teal** | 10px |
| **4º (centro-abajo)** | ~40% ancho × 15% alto | **Violeta** | 10px |

- Sombras: drop shadow negro ~10px blur, offset 2px abajo + **glow exterior del color del borde (~3px blur)**.

**Panel del campeón (1º):**
- **Corona 3D dorada** centrada arriba del panel (~15% de su alto): amarillo brillante con highlights, **3 gemas circulares magenta en el frente** + gemas pequeñas laterales; **glow dorado** (~4px blur).
- Detrás del texto: **avatar hexágono dorado con glow** (tema HexaSort).
- **"CHAMPION"** — uppercase bold sans, dorado `#FFD700`, ~22px.
- **Nombre (p. ej. "ALEX")** — uppercase bold sans, amarillo cálido `#FFCC00`, ~32px.
- **Score (p. ej. "4,589,200")** — bold grand, off-white `#FFF5E0` + glow amarillo cálido (~2px blur), ~36px.

**Paneles 2º/3º/4º:** avatar hexágono con glow del color de su borde; nombre en el color del borde (~16–18px); score off-white con glow del color (~22–24px).

**Confeti (SOLO en esta pantalla):**
- Colores neón saturados: magenta `#FF2A7D`, cyan `#00E5FF`, amarillo `#FFD700`, violeta `#9C50FF`, blanco `#FFFFFF`.
- Formas: **barras finas de 2px (tubos neón) verticales/horizontales + hexágonos pequeños** (motivo del juego).
- Distribución: toda la pantalla, concentrado arriba y abajo; tamaños ~5px a ~15px; algunos con motion blur (sensación de caída/flotación).

**Título "¡FIN DEL JUEGO!":**
- ~48px, **bold display sans redondeada, uppercase con signos de exclamación**.
- Color amarillo brillante `#FFCC00` con **outline interior blanco grueso** + glow amarillo suave (~3px blur).
- Centrado a ~10% de la altura.

**Botones:**

| Botón | Tipo | Visual exacto |
|---|---|---|
| **REPLAY** | Primario | Bottom ~85% alto; rectángulo redondeado ~15px; fill navy semitransparente; **borde neón dorado con glow ~3px**; texto uppercase bold blanco ~24px + icono circular de refresh |
| **MENU** | Secundario | Debajo de REPLAY, lado izquierdo, ~25% ancho × 8% alto; rectángulo ~10px; fill navy semitransparente; **borde neón cyan con glow**; texto blanco bold ~18px |
| **SHARE** | Secundario | Lado derecho, igual que MENU pero **borde neón magenta con glow**; texto + icono (p. ej. Facebook) blanco |

---

## 2. PALETA EXTRAÍDA DE LAS IMÁGENES

> Derivada VISUALMENTE de las 4 imágenes (no copiada de la art-bible). Rango observado entre paréntesis; el hex elegido es el token de implementación.

### 2.1 Roles → Hex (obligatorio)

| Rol | Hex | Observado en |
|---|---|---|
| **Fondo (base pantalla)** | `#0A0F1A` | Todas (varía `#0A0D14`–`#0A0F2C`) |
| **Fondo brillo central (radial)** | `#1A2035` | Menú (centro del gradiente radial); tablero (detrás de la cuadrícula) |
| **Fondo extremo oscuro** | `#050810` | Menú (bordes); pool (extremo inferior `#000`) |
| **Superficie panel (menú)** | gradiente `#1E2636` → `#171D2A` | Menú, panel central |
| **Superficie HUD/chips/barra pool** | `#22272E` | Tablero (chips, contador, barra pool) |
| **Superficie interior inputs** | `#0C1018` / `#0D141E` | Menú (área nombres) |
| **Superficie celda vacía (tablero)** | `#111824` | Tablero |
| **Borde neón del tablero (celdas)** | `#00A8FF` | Tablero (celdas vacías, 2–3px + glow) |
| **Borde UI neutro** | `#3A4559` / `#4A556A` | Menú (borde externo panel, botones no seleccionados) |
| **Borde input** | `#3A608A` | Menú (campos de nombre) |
| **Borde interior bisel** | `#10141F` | Menú (panel) |
| **Pieza color 1 — ROSA** | core `#FF2A6D` · lateral oscuro `#B31647` · variante pool `#FF6B9D` | Tablero + Pool |
| **Pieza color 2 — VERDE/MENTA** | core `#00F5A0` · lateral oscuro `#00A876` | Tablero |
| **Pieza color 3 — VIOLETA** | core `#B829DD` · lateral oscuro `#6B198E` · variante pool `#9C27B0` | Tablero + Pool |
| **Pieza variante pool — CYAN** | core `#00E5FF` · lateral oscuro `#0D47A1` | Pool (torre central) |
| **CTA dorado (JUGAR / PLAY / REPLAY / selección)** | gradiente `#FFD700` → `#F5A623` → `#E8A618` → `#C77D12`; top claro `#FFD080`; glow `rgba(245,166,35,0.6)` | Menú + Pool + Fin |
| **Éxito / premio / título** | `#FFD166` (éxito) · `#FFE566`→`#FFA500` (gradiente título) · contorno título `#CC6600` | Menú (título), Fin (corona) |
| **Acento jugador 2 / 2º puesto** | `#FF4D8A` / `#FF6B9D` (magenta-rosa) | Menú (hex decorativo), Fin (2º) |
| **Acento cyan secundario** | `#00E5FF` / `#00FFCC` / `#00CCFF` | Menú (hex decorativo), Pool, Fin (3º, botón MENU) |
| **Acento violeta terciario** | `#8A4DFF` / `#9C27B0` / `#9C50FF` | Menú (hex decorativo), Fin (4º, confeti) |
| **Peligro** | `#FF4D4F` | (no visible en imágenes; mantener de art-bible) |
| **Texto primario** | `#F4F6FB` (blanco azulado) | Todas (títulos menores, scores) |
| **Texto secundario** | `#9AA3B5` / `#80A0C0` / `#8A95A8` | Menú (inputs), Tablero (labels) |
| **Tinta sobre dorado (texto en botones)** | `#2A2010` (selector) / `#4A3510` (JUGAR) | Menú |

### 2.2 Tokens CSS propuestos (usar siempre, nunca hex sueltos)

```css
:root {
  --fondo:              #0A0F1A;
  --fondo-brillo:       #1A2035;   /* centro radial */
  --fondo-extremo:      #050810;
  --superficie-panel:   #1E2636;   /* -> #171D2A gradiente */
  --superficie-hud:     #22272E;
  --superficie-input:   #0D141E;
  --celda-vacia:        #111824;
  --borde-neon-tablero: #00A8FF;
  --borde-ui:           #3A4559;
  --borde-input:        #3A608A;

  --pieza-rosa:    #FF2A6D;  --pieza-rosa-side:  #B31647;
  --pieza-verde:   #00F5A0;  --pieza-verde-side: #00A876;
  --pieza-violeta: #B829DD;  --pieza-violeta-side:#6B198E;
  --pieza-cyan:    #00E5FF;  --pieza-cyan-side:  #0D47A1;

  --dorado:       #FFD700;
  --dorado-bajo:  #F5A623;
  --dorado-osc:   #C77D12;
  --exito:        #FFD166;
  --magenta:      #FF4D8A;
  --violeta-acento:#8A4DFF;
  --peligro:      #FF4D4F;

  --texto-primario:   #F4F6FB;
  --texto-secundario: #9AA3B5;
  --tinta:            #0B0F1A;   /* texto sobre superficies claras */
  --tinta-dorado:     #4A3510;   /* texto sobre botones dorados */
}
```

### 2.3 Regla de color global (60/30/10 — derivada)
- **60%** azul-negro profundo (fondo + superficies oscuras): las 4 imágenes.
- **30%** piezas neón (rosa/verde/violeta/cyan) y sus glows.
- **10%** acentos funcionales: dorado (CTA/premio/turno), cian del tablero, magenta/violeta de acento.
- **El dorado es el color de "acción/premio":** botón JUGAR, turno activo, selección de pool, campeón, REPLAY. El azul neón `#00A8FF` es el color "de sistema" del tablero. Los colores vivos de las piezas NUNCA se usan en UI de menú/sistema salvo como hexágonos decorativos o confeti.

---

## 3. TIPOGRAFÍA

**Lo que se ve en las imágenes:**
- **Títulos display:** bold con terminaciones redondeadas, uppercase ("HEXASORT PARTY", "¡FIN DEL JUEGO!", "CHAMPION") — estilo "Montserrat Black"/"Bungee" redondeada. En las imágenes IA el render es de familia display geométrica-redondeada.
- **UI y botones:** sans-serif bold (JUGAR, REPLAY, MENU, SHARE, SELECT PIECES).
- **Cuerpo/labels:** sans regular-clara (nombres de jugadores, "SCORE:", "ROUND", "LEVEL 25").

**Implementación (coherente con art-bible §3):**

| Nivel | Fuente | Peso | Uso |
|---|---|---|---|
| Logo / título de pantalla | **Baloo 2** | 800 | "HEXASORT PARTY", "¡FIN DEL JUEGO!", "SELECT PIECES", "CHAMPION" — uppercase, sin letter-spacing |
| Números grandes (score, ronda, contador de pila) | **Baloo 2** | 700–800 | Tabulares; color del contexto (dorado en turno/ronda, off-white con glow en scores) |
| Botones | **Baloo 2** | 700 | JUGAR, REPLAY, MENU, SHARE — uppercase |
| Nombre de jugadores / labels | **Nunito** | 600–700 | "Jugador 1", "SCORE:", "ROUND", "LEVEL 25" |
| Microetiquetas | **Nunito** | 700 | Uppercase, color secundario, espaciado 0.08em (p. ej. "ROUND") |

**Tamaños relativos (sobre base de diseño 360×640):**
- Título de pantalla: ~48px (¡FIN DEL JUEGO!) / "HEXASORT" ~64px + "PARTY" ~54px.
- Score grande (fin de juego): ~36px con glow.
- Nombre del campeón: ~32px; nombre de otros puestos: ~16–18px.
- Número de ronda (círculo HUD): ~24–28px.
- Botones primarios: ~18–24px bold.
- Inputs/cuerpo: ~14–16px.
- Microetiquetas: ~10–11px uppercase espaciadas.

**Colores de texto:** primario `#F4F6FB`; secundario `#9AA3B5`/`#80A0C0`; sobre dorado SIEMPRE tinta oscura (`#2A2010`/`#4A3510`) — nunca blanco sobre dorado. Contorno interior blanco grueso solo para el título de victoria.

---

## 4. ESTILO DE PILAS 3D (la pieza central del look)

**Forma:** prisma hexagonal regular (6 lados, geometría real — nunca rombos ni cuadrados).

**Proporciones (obligatorias):**
- **Grosor lateral (profundidad 3D): 15–20% del ancho del hex top** (imagen tablero) y hasta ~20% en las tarjetas de pool. El lateral es lo que hace "3D" la pila: sin él, es una pegatina.
- Cada pieza apilada desplaza ~60–70% de su altura sobre la anterior (escalonado), dejando visible la arista inferior de la pieza superior sobre el lateral de la inferior.
- Pila de N piezas = N prismas superpuestos; la pieza superior es la única con top face totalmente visible.

**Pintado de cada prisma (de arriba abajo):**
1. **Top face:** color core (p. ej. `#FF2A6D`) con **gradiente radial sutil — centro más brillante, borde más oscuro** (acabado glossy/pulido).
2. **Lateral:** gradiente vertical oscuro→claro de abajo hacia arriba (p. ej. rosa: `#4A148C → #FF6B9D` en pool; o borde oscuro `#B31647` en tablero) — el lado más oscuro abajo da profundidad.
3. **Highlight:** línea blanca fina (1–2px) a lo largo de la arista superior del lateral (luz cenital de estudio). En todas las piezas de todas las pantallas.
4. **Contorno:** interior sutil del color oscurecido definiendo el hexágono (borde ~15% más oscuro que el core).

**Luz y sombra:**
- Drop shadow bajo cada pila: offset 5px, blur suave, `rgba(0,0,0,0.2)`.
- **Glow base del color de la pila:** `box-shadow`/`drop-shadow` con spread 5–10px del color core (p. ej. `0 0 12px rgba(255,42,109,0.45)`).
- "Espejo" invertido opcional bajo la pila: glow suave del color en el suelo de la celda (reflejo ambiental).

**Contador:** número Baloo 2 800 en tinta oscura `#0B0F1A` sobre la top face de la pieza superior (art-bible), con contraste verificado.

**Partículas (interior de la pila viva):** sobre pilas de 3+ piezas flotan partículas diminutas (1–2px, 3–6 unidades) del color de la pila, elevándose ~10–20px con opacidad variable. En pool (estático) no hay partículas; en tablero sí.

**Regla de oro:** si una pila no se lee como "un cuerpo 3D con lateral grueso", está mal implementada.

---

## 5. COMPONENTES DE UI POR PANTALLA

### Menú
| Componente | Estilo |
|---|---|
| Logo | Hexágono dorado metálico `#FFD700→#E8A317`, hex interior concéntrico + líneas de conexión, lens flare esquina sup-der, glow dorado; ~20% ancho pantalla |
| Título | 2 líneas Baloo 2 800, gradiente `#FFE566→#FFA500`, contorno `#CC6600` 2–3px, drop shadow `#0A0A0A`, glow naranja |
| Panel central | `#1E2636→#171D2A`, radio 15px, borde doble (`#3A4559` ext / `#10141F` int), sombra `0 10px 40px rgba(0,0,0,.5)` |
| Selector jugadores | 3 círculos ~18% ancho panel; activo = dorado `#FFD080→#F5A623` + glow + tinta `#2A2010`; inactivo = transparente + borde `#4A556A` + texto `#8A95A8` |
| Inputs nombre | Radio 10px, borde 2px `#3A608A` + brillo, fill `#0D141E`, texto `#80A0C0`; foco = borde+glow dorado `#FFD080` |
| Botón JUGAR | Radio 8px, gradiente dorado 4-stop, glow `0 0 15px rgba(245,166,35,.6)`, texto `#4A3510` con sombreado interior |

### Tablero (HUD)
| Componente | Estilo |
|---|---|
| Chip de turno | Hexágono alargado redondeado, gradiente `#FFD700→#B8860B`, texto bold oscuro + chevrones ">>>", contorno marrón fino, glow dorado |
| Contador de ronda | Círculo `#22272E` + anillo dorado grueso `#FFD700`; "ROUND" micro + número Baloo 2 grande dorado |
| Chip score/nombre | Rectángulo `#22272E`, outline azul claro, score blanco brillante, nombre gris; 2 botones cuadrados outline azul claro (settings/info) |
| Celdas vacías | `#111824` con bevel interno + borde neón `#00A8FF` 2–3px + glow |
| Barra pool | Rectángulo `#22272E` + outline azul claro, 80% ancho; 3 slots hex con pieza 3D pequeña (inset circular oscuro + outline del color) |
| Controles inferiores | 3 círculos pequeños oscuros con outline azul claro (undo, grid, settings) |

### Pool
| Componente | Estilo |
|---|---|
| Título "SELECT PIECES" | Baloo 2 700–800, gris claro/blanco, centrado; "LEVEL 25" top-right menor |
| Tarjeta de pila | Rectángulo radio ~10%, fill azul-negro, borde 2px + glow 5px del color; **seleccionada = borde dorado + checkmark dorado** |
| Pila en tarjeta | Prisma hex 3D con lateral gradiente oscuro→claro (alturas 4/4/2 en la imagen) |
| Botón play | Círculo ~15% ancho, gradiente `#FFD700→#FFE082`, triángulo play oscuro, anillo dorado, glow |

### Fin de juego
| Componente | Estilo |
|---|---|
| Título | ~48px Baloo 2 800, `#FFCC00`, outline interior blanco grueso + glow amarillo |
| Podium | Panel oscuro 85% opacidad, sup. redondeada 20px, fondo puntiagudo, borde neón cyan oscuro + glow |
| Panel 1º | Borde dorado brillante + halo 5px, radio 12px, elevado; corona 3D dorada con 3 gemas magenta | 
| Paneles 2º/3º/4º | Bordes neón magenta/cyan/violeta + glow 3px, radio 10px; avatar hex del color; nombre del color; score off-white con glow del color |
| Confeti | Barras 2px + hexágonos pequeños, `#FF2A7D`/`#00E5FF`/`#FFD700`/`#9C50FF`/`#FFF`, concentrado arriba/abajo, algunos con motion blur |
| REPLAY | Rectángulo radio 15px, navy semitransparente, borde dorado glow 3px, texto blanco + icono refresh |
| MENU / SHARE | Rectángulos radio 10px, ~25% ancho, borde neón cyan / magenta + glow, texto blanco |

---

## 6. REGLAS DE CONSISTENCIA ENTRE PANTALLAS

**Se repite SIEMPRE (no negociable):**
1. **Fondo común:** azul-negro profundo `#0A0F1A` con gradiente radial hacia `#1A2035` (centro focal), viñeta oscura en esquinas, micro-estrellas 1–2px, **líneas de circuito tenues** y **hexágonos decorativos neón flotantes** (solo en menú/transiciones; en tablero el tablero es el decorado).
2. **Glow del color del elemento:** todo borde/botón/pieza emite glow de su propio color — nunca glow blanco genérico (rompe el neón).
3. **CTA principal = dorado:** JUGAR, PLAY, REPLAY, selección activa, turno activo, campeón. El dorado es el verbo de la UI.
4. **Sistema del tablero = azul neón `#00A8FF`:** celdas vacías y controles HUD neutros usan cian/azul claro como color "de utilidad" (outlines, botones settings).
5. **Identidad de las piezas idéntica en todas las pantallas:** mismos 3 colores core (rosa `#FF2A6D`, verde `#00F5A0`, violeta `#B829DD` — con variante cyan `#00E5FF` disponible en pool), mismo prisma 3D (lateral 15–20%, highlight blanco superior, drop shadow + glow). Un investigador debe reconocer una pila del pool dentro de una celda del tablero sin dudar.
6. **Tipografía fija:** Baloo 2 (display/números/botones) + Nunito (UI/cuerpo). Nada de otras familias.
7. **Sombras suaves negras** (blur 5–40px, opacity ≤50%); redondeo general 8–20px; los hexágonos del tablero y piezas SIEMPRE con geometría real de 6 lados.
8. **Texto claro sobre oscuro, tinta oscura sobre dorado/colores claros** (nunca blanco sobre dorado).

**Varía entre pantallas:**
- **Confeti:** SOLO en fin de juego/victoria (art-bible §4: ningún otro evento usa confetti).
- **Hexágonos decorativos del fondo:** presentes en menú y (tenues) en pool; en tablero desaparecen — el tablero es el decorado.
- **Brillo focal:** menú = centro-superior (logo); tablero = centro (cuadrícula); pool = centro (tarjetas); fin = centro-superior (campeón). Cada pantalla dirige la mirada con su propio foco de luz.
- **Intensidad del HUD:** menú/pool/fin pueden tener UI "vestida" (dorados, biseles); **en tablero el HUD se calla** (chips neutros `#22272E`, dorado solo para turno/ronda) — el tablero es la estrella (art-bible §1).

---

## 7. DIFERENCIAS PUNTUALES vs ART-BIBLE (LA IMAGEN MANDA)

| Tema | Art-bible dice | Imágenes muestran | Resolución |
|---|---|---|---|
| **Bordes de celdas vacías** | `#36405A` sutil, sin brillo exterior | **Borde neón azul `#00A8FF` 2–3px CON glow** | ✅ Usar `#00A8FF` con glow (look HEX FRVR dark brillante). `#36405A` queda como borde neutro de UI genérica |
| **Acento CTA** | `#4CC9F0` (cian) | **CTA = DORADO** `#FFD700→#F5A623` en las 4 pantallas | ✅ CTA dorado; cian queda para utilidad/sistema del tablero |
| **Marca "no dorado"** | Prohibe marcos dorados (Royal Match) | El dorado es el sistema de premio/acción del look maestro (logo, título, JUGAR, turno, campeón) | ✅ Dorado como **acento funcional de premio/CTA**, nunca como marco decorativo permanente del tablero de juego |
| **Color de pieza verde** | `#4DE3C1` (menta pastel) | **`#00F5A0`→`#00A876`** (menta neón más intenso) | ✅ Usar valores de imagen |
| **Fondo** | `#0B0F1A` | `#0A0F1A` (idéntico en la práctica) | ✅ Se mantiene `#0A0F1A` |
| **Título de victoria** | Banner "¡Victoria!" | **"¡FIN DEL JUEGO!" con outline interior blanco** | ✅ Texto y estilo según imagen |

---

## 8. CHECKLIST DE ACEPTACIÓN PARA EL IMPLEMENTADOR

1. [ ] Las 4 pantallas comparten el mismo fondo azul-negro con gradiente radial, estrellas y circuitos.
2. [ ] Las pilas son prismas hex con lateral 15–20% del ancho, gradiente lateral, highlight blanco superior, drop shadow y glow del color.
3. [ ] Celdas del tablero con borde neón `#00A8FF` + glow.
4. [ ] Todo CTA principal dorado con gradiente y glow dorado; tinta oscura sobre el dorado.
5. [ ] Chip de turno = hexágono dorado alargado; contador de ronda = círculo con anillo dorado.
6. [ ] Tarjeta de pila seleccionada = borde dorado + checkmark circular dorado.
7. [ ] Podium con fondo puntiagudo, sub-paneles por color (dorado/magenta/cyan/violeta), corona 3D con 3 gemas magenta.
8. [ ] Confeti solo en fin de juego: barras neón 2px + hexágonos de los 5 colores.
9. [ ] Título de victoria con outline interior blanco.
10. [ ] Baloo 2 + Nunito en toda la UI; sin blancos puros `#FFFFFF` ni negros puros.