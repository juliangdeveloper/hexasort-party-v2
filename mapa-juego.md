# Mapa Técnico — HexaSort Party v2 (index.html · 1034 líneas)

> **Propósito:** guía para re-estilizar el look (dirección NEÓN OSCURO) SIN romper la lógica de juego.
> Archivo fuente único: `/mnt/c/Users/Rog/Workspace/01_PROYECTOS/hexasort-party-v2/index.html`
> **REGLAS DE ORO:** ① el CSS es la única "superficie de piel" — tocar CSS no rompe lógica, siempre que no elimines clases/IDs que el JS consulta (lista en §6); ② los colores de juego están DUPLICADOS (paleta `:root` para UI + objetos `COLORS` en JS para celdas/pilas) — re-estilizar colores exige tocar AMBOS; ③ hay sleeps JS sincronizados con animaciones CSS (300/800/1200 ms) — no alargar animaciones sin tocar JS.

---

## 1. ESTRUCTURA DEL DOCUMENTO (bloques y líneas)

| Líneas | Bloque |
|---|---|
| 1–6 | Cabecera HTML (`<!DOCTYPE>`, `<head>`, `<title>` en L6) |
| **7–172** | **CSS completo** (bloque `<style>`) |
| 8 | Reset universal `*` |
| 9–10 | **Paleta `:root`** (variables de color de UI) |
| 11 | `body` (fondo, tipografía base, color de texto) |
| 14–39 | CSS del MENÚ |
| 41–50 | CSS del LAYOUT DE PARTIDA (barra top, chips de jugador) |
| 52–71 | CSS del TABLERO HEX (celdas, pilas, animaciones) |
| 73–80 | Shake de pantalla + overlays de merge (dots deslizantes) |
| 82–88 | Texto CASCADE + flechas de merge + resaltado valid-target |
| 90–102 | CSS del POOL (3 pilas seleccionables) |
| 104–110 | Score popup + burst de cascada |
| 112–115 | Paneles laterales de puntaje |
| 117–120 | Overlay de eventos (no usado por #end, pero definido) |
| 122–128 | Modal de REGLAS |
| 130–136 | TUTORIAL (fondo + caja) |
| 138–139 | Mensaje `.msg` |
| 141–153 | Pantalla END (rank + confetti) |
| 155–171 | Media query móvil (≤480px) |
| 173 | `</head>` |
| **174–254** | **HTML del body** (menú, partida, fin, reglas, tutorial) |
| 176–202 | `<div id="menu">` |
| 204–218 | `<div id="game">` |
| 220–228 | `<div id="end">` |
| 230–250 | Modal de reglas `#rulesM` |
| 252–254 | Tutorial `#tutBg` / `#tutBox` |
| **256–1031** | **JS** (bloque `<script>`) |
| 257–290 | Constantes (COLORES, layout, adyacencias, umbral) |
| 292–297 | Estado global `G` |
| 299–314 | Setup de jugadores |
| 316–336 | Inicio de partida |
| 338–361 | Generación del pool |
| 363–411 | Rondas / turnos |
| 413–691 | Colocación, merges, cascadas, scoring y efectos |
| 693–703 | Penalización por tablero cerrado |
| 705–843 | IA (3 niveles) |
| 845–884 | Fin de partida (confetti + ranking) |
| 886–990 | Render de todo el DOM |
| 992–1021 | Tutorial |
| 1023–1028 | Utilidades de UI (`showS`, `setMsg`, `sleep`) |
| 1030–1031 | Init (`renderPS(2)`) |
| 1032–1034 | `</script>`, `</body>`, `</html>` |

---

## 2. PANTALLAS Y OVERLAYS

### `#menu` (L177–202) — pantalla activa por defecto (clase `screen active` en L177)
| Elemento | Línea | Función |
|---|---|---|
| `<h1>` | 178 | Título "⬡ HexaSort Party v2" (gradiente animado) |
| `p.sub` | 179 | Subtítulo |
| `div.ms` (Jugadores) | 180–188 | Caja de configuración |
| `#pcBtns` (botones .cbtn) | 182–186 | Selector 2/3/4 jugadores → `setPC(n)` |
| `#pSetup` | 187 | Contenedor (llenado por JS: filas `.pr`) |
| `div.ms` (Rondas) | 189–196 | Radio Corta 5 / Normal 10 / Larga 15 (name=`rnd`) |
| `div.bg` | 197–201 | Botones: Jugar (`startG`), Tutorial (`startTut`), Reglas (`showRules`) |

### `#game` (L205–218) — pantalla de partida
| Elemento | Línea | Función |
|---|---|---|
| `#roundBadge` | 207 | "Ronda X/Y" (JS escribe texto) |
| `#turnInfo` | 208 | Orden de turnos (JS escribe texto) |
| botón btn-sm | 209 | Abre reglas (`showRules`) |
| `#playerBar` | 211 | Chips `.pb-chip` de jugadores (JS renderiza) |
| `#hexBoard` | 213 | Tablero 19 hexágonos (JS renderiza celdas `.hex-cell[data-ci]`) |
| `#poolWrap` | 215 | 3 pilas `.pool-stack` (JS renderiza) |
| `#msg` | 216 | Mensaje de estado (JS `setMsg`) |
| `#sidePanels` | 217 | Paneles `.sp` con puntaje (JS renderiza) |

### `#end` (L221–228) — pantalla de fin
| Elemento | Línea | Función |
|---|---|---|
| `<h1>` | 222 | "🏆 ¡Fin del Juego!" |
| `#endRank` | 223 | Ranking `.end-rank` (JS renderiza en `endGame`) |
| botones | 225–226 | Menú (`showS('menu')`) y Revancha (`startG`) |

### Overlays / modales
| Elemento | Línea | Función |
|---|---|---|
| `#rulesM` (.modal-bg) | 231–250 | Modal de reglas; `showRules()`/`hideRules()` (JS L1026–1027) |
| `#tutBg` (.tut-bg) | 253 | Fondo oscurecido del tutorial |
| `#tutBox` (.tut-box) | 254 | Caja inferior del tutorial con `#tutTx` (texto) y `#tutBtn` (botón) |

**Nota:** `.overlay`/`.overlay-card` (CSS L117–120) están definidos pero el HTML actual no los usa (el fin usa la pantalla `#end`).

---

## 3. CSS CLAVE (selectores + función visual + línea de inicio)

### Paleta y base
| Selector | Línea | Función |
|---|---|---|
| `:root` | **9–10** | Variables `--bg, --panel, --panel2, --accent, --text, --dim` + 6 colores de juego (`--red…--orange`) |
| `body` | 11 | Fondo `--bg`, font-family, color de texto |

### Menú
| Selector | Línea | Función |
|---|---|---|
| `#menu h1` + `@keyframes shimmer` | 16–18 | Título con gradiente multicolor y animación de brillo |
| `.ms` | 20 | Panel/cartel de configuración (fondo `--panel`, radius 16) |
| `.pr` (y `input`, `select`) | 22–25 | Fila jugador: label color + input nombre + select tipo |
| `.btn` | 26 | Base de botones |
| `.btn-p` + `btnShimmer` | 27–30 | Botón primario (gradiente accent→rosa, brillo deslizante, hover glow) |
| `.btn-s`, `.btn-sm` | 31–32 | Botón secundario / pequeño |
| `.bg` | 33 | Contenedor flex de botones |
| `.cbtn` / `.cbtn.on` | 34–35 | Botones circulares 2/3/4 jugadores; `.on` = seleccionado (JS togglea esta clase) |
| `.pcb` (label, :has(input:checked), input) | 36–39 | Grupo de radio de rondas (borde accent cuando checked) |

### Partida (layout)
| Selector | Línea | Función |
|---|---|---|
| `.round-badge` | 44 | Insignia "Ronda X/Y" |
| `.player-bar` | 46 | Contenedor de chips |
| `.pb-chip` / `.current` / `.pb-bar` / `.pb-pts` | 47–50 | Chip de jugador: color de borde/texto, barra de progreso relativa al puntaje; `.current` = turno activo (JS togglea) |

### Tablero hex (el corazón visual)
| Selector | Línea | Función |
|---|---|---|
| `.hex-board` | 54 | Contenedor 340×360 px, recibe `.shake` |
| `.hex-row` | 55 | Fila con solape negativo (−12px) para panal |
| `.hex-cell` | **56–58** | CELDA: clip-path hexágono 64×56, fondo/borde dinámicos por JS (inline), cursor pointer |
| `.hex-cell:hover:not(.locked)` | 59 | Hover: scale 1.12 + borde accent + brillo |
| `.hex-cell.locked` | 60 | Cursor default en celdas ocupadas |
| `.hex-cell.empty` | 61 | Celda vacía translúcida |
| `.stack-vis` | 62 | Pila visual (column-reverse, capas de abajo→arriba) |
| `.stack-layer` | 63 | Capa de pila (16×5px; JS sobreescribe alto/color inline) |
| `.stack-top` | 64 | Capa superior (definida pero JS usa inline — cuidado) |
| `.hex-count` | 65 | Contador de hexágonos de la pila |
| `.hex-cell.clearing` + `clearPop` | 66–67 | Animación de desaparición (≥10) |
| `.hex-cell.merging` + `mergeGlow` | 68–69 | Glow al recibir merge |
| `.hex-cell.merge-from` + `mergeFrom` | 70–71 | Dimm al donar hexágonos |
| `.hex-board.shake` + `shakeBoard` | 74–75 | Sacudida al despejar |

### Efectos de merge / cascada / scoring
| Selector | Línea | Función |
|---|---|---|
| `.merge-dot` + `.animate` | 78–80 | Puntos de color que viajan del origen al destino (JS los crea dinámicamente) |
| `.cascade-text` + `cascadeTextPop` | 83–85 | Texto "✨ CASCADE ×N" centrado (JS crea dinámicamente, color = `--accent`) |
| `.hex-cell.merge-arrow::after` + `arrowFly` | 86–87 | Flecha → en celdas donantes (CSS pseudo-elemento; JS agrega clase) |
| `.hex-cell.valid-target` | 88 | Resaltado de celdas válidas al seleccionar pila (JS agrega) |
| `.score-pop` + `popUp` | 105–107 | "+N pts" flotante (JS crea dinámicamente) |
| `.cascade-burst` + `burstSpin` | 108–110 | Brillo ✨ al cascadear (JS crea dinámicamente) |

### Pool (las 3 pilas a colocar)
| Selector | Línea | Función |
|---|---|---|
| `.pool-wrap` | 91 | Contenedor flex |
| `.pool-stack` (+ hover, ::after) | **92–96** | Pila del pool: cartel con hover elevado + glow accent |
| `.pool-stack.selected` (+ ::before ✓) | 97–98 | Pila elegida (JS agrega clase; checkmark) |
| `.pool-stack.used` | 99 | Pila ya usada: opacidad 0.2, sin clicks (JS agrega) |
| `.ps-hex` | 100 | Pilas de capas (column-reverse) |
| `.ps-layer` | 101 | Capa de color (22×8px; JS setea color inline) |
| `.ps-label` | 102 | "N" + puntos de colores |

### Paneles laterales / mensaje
| Selector | Línea | Función |
|---|---|---|
| `.side-panels`, `.sp`, `.sp-name`, `.sp-score` | 113–115 | Filas de puntaje por jugador |
| `.msg` | 139 | Mensaje de estado (borde accent) |

### Fin de partida
| Selector | Línea | Función |
|---|---|---|
| `#end h1` | 143 | Título con gradiente |
| `.end-rank` / `.end-rank.w` (+::before 👑) | 144–146 | Tarjeta de ranking; `.w` = ganador corona (JS agrega) |
| `.er-pos`, `.er-name`, `.er-score` | 147–149 | Posición/medalla, nombre (color inline por jugador), puntos |
| `.confetti` + `confettiFall` | 152–153 | Confeti (JS crea 30 piezas; variables CSS `--fall-dur/--fall-delay/--spin` inline) |

### Responsive móvil
| Selector | Línea | Función |
|---|---|---|
| `@media(max-width:480px)` | 156–171 | Reducción de hex-cells (48×42), board 260×280, pool en columna, botones más grandes |

---

## 4. MECÁNICA EN JS (documentación — NO MODIFICAR)

### Constantes y estado (L257–297)
| Función/const | Línea | Qué hace |
|---|---|---|
| `COLORS` | 258–261 | 6 colores de juego: `{c:'#hex', n:'Nombre'}` — **usado para color inline de celdas/pilas/dots** |
| `PCOL` | 263 | 4 colores de jugadores `['#ec4899','#6366f1','#10b981','#f59e0b']` |
| `ROWS` | 266 | Layout panal 3-4-5-4-3 (19 celdas) |
| `ADJ` | 268–288 | Adyacencias entre los 19 hexágonos (grafo fijo) |
| `THRESHOLD` | 290 | Umbral de desaparición = 10 |
| `G` | 293–297 | Estado global: `players[]`, `board[]` (19× `{stack:[colores]}`), `pool[]` (3× `{layers,height}`), `poolUsed[]`, `selectedPool`, `curP`, `rotationOffset`, `phase`, `over`, `animating` |
| **Estructura de datos crítica** | 335 | `G.board[i].stack` = array de strings de color, **layers[0] = base, último = tope** |

### Setup e inicio (L299–336)
| Función | Línea | Qué hace |
|---|---|---|
| `setPC(n)` | 300 | Marca botón 2/3/4 activo y llama `renderPS(n)` |
| `renderPS(n)` | 304 | Llena `#pSetup` con filas `.pr` (inputs `pn{i}`, selects `pt{i}`) |
| `getPC()` / `getDur()` | 313–314 | Lee nº de jugadores y rondas del DOM |
| `startG(tut)` | 317 | Construye `G.players` (nombre/tipo/color/score), resetea tablero/pool, llama `nextRound()`, muestra `#game` |
| `resetBoard()` | 333 | Crea 19 celdas vacías `{stack:[]}` |

### Pool (L338–361)
| Función | Línea | Qué hace |
|---|---|---|
| `generatePool()` | 339 | Crea 3 pilas: alto 2–5, 2–4 colores distintos garantizados; `G.selectedPool=-1` |

### Turnos (L363–411)
| Función | Línea | Qué hace |
|---|---|---|
| `nextRound()` | 364 | Incrementa ronda; si se acabaron → `endGame()`. Genera pool, rota orden (`rotationOffset`), `startTurn()` |
| `getCurrentPlayerIdx()` | 374 | `(rotationOffset + curP) % players.length` — **rotación de orden** |
| `startTurn()` | 378 | Activa fase turn, regenera pool si los 3 usados, chequea `canPlaceAny()` (si no → penalización), renderiza, si IA → `aiTurn()` en 600ms |
| `poolAvailable()` / `canPlaceAny()` | 403–411 | ¿Quedan pilas sin usar? ¿Hay celda vacía + pila disponible? |

### Colocación, merge y cascada (L413–691) — ⚠️ NÚCLEO, NO TOCAR
| Función | Línea | Qué hace |
|---|---|---|
| `selectPool(idx)` | 414 | Marca pila elegida (solo humano, no animando, no usada), resalta `.valid-target` en vacías |
| `clickCell(ci)` | 426 | Valida y llama `placeStack(ci, selectedPool)` |
| `placeStack(cellIdx,poolIdx)` | **435–582** | Coloca la pila en la celda (push de layers), marca usada, y ejecuta el **bucle de merges en cascada**: BFS de grupos conectados por color tope → elige target (más grande; empates → celda que recibió) → mueve hexágonos → si el target alcanza ≥10 `removeTopColor` + suma puntos (`cleared × (1 + (nivel-1)*0.5)`) → repite hasta no haber más merges. Controla `G.animating`, avanza turno/ronda |
| `getTopColor(ci)` | 584 | Color del tope de la pila |
| `countTopColor(ci)` | 589 | Cuenta capas iguales desde el tope |
| `removeTopColor(ci)` | 601 | Pop del color tope hasta cambiarlo; devuelve nº eliminado |
| `highlightCell(ci,cls)` | 610 | Agrega clase de animación 800ms a la celda `[data-ci]` |
| `showMergeOverlays(sources,target,color)` | 621 | Crea 3 dots por origen que se deslizan al target (dinámico) |
| `showCascadeText(level)` / `showCascadeBurst(ci)` / `showScorePop(ci,pts,extra)` | 657–691 | Efectos dinámicos en body (clases `.cascade-text`, `.cascade-burst`, `.score-pop`) |

### Penalización (L693–703)
| Función | Línea | Qué hace |
|---|---|---|
| `boardLockPenalty()` | 694 | −5 a TODOS (min 0), `resetBoard()`, mensaje, regenera pool y sigue en 2s |

### IA (L705–843) — NO TOCAR
| Función | Línea | Qué hace |
|---|---|---|
| `aiTurn()` | 706 | Evalúa todas las combinaciones (pila × celda vacía) con `evalPlacement`, elige la mejor (o aleatoria) y `placeStack` |
| `evalPlacement(ci,stack,type)` | **735–843** | easy: aleatorio; medium: adyacencias mismas; hard: SIMULACIÓN VIRTUAL de la cascada completa (copia de tablero en L757) |

### Fin de partida (L845–884)
| Función | Línea | Qué hace |
|---|---|---|
| `showConfetti()` | 846 | Crea 30 divs `.confetti` con colores/duración/forma aleatorios |
| `endGame()` | 866 | `G.over=true`, muestra `#end`, confeti, ordena por score (desempate por hexágonos en tablero), renderiza `#endRank` con medallas 🥇🥈🥉4️⃣ y `.end-rank.w` para el ganador |

### Render (L886–990)
| Función | Línea | Qué hace |
|---|---|---|
| `renderAll()` | 887 | Board + pool + barra + paneles + roundBadge + turnInfo |
| `renderBoard()` | **901–946** | Genera HTML del tablero: filas → `.hex-cell[data-ci]` con `background/border-color` inline según color tope, clases `empty`/`locked`, onclick `clickCell(ci)`, capas `.stack-layer` (compacta si >10: muestra 2 + "..." + 3), `.hex-count` |
| `renderPool()` | 948–969 | Genera 3 `.pool-stack` (clases `used`/`selected`, onclick `selectPool(i)`), capas `.ps-layer`, label con puntos de color |
| `renderPlayerBar()` | 971–982 | Chips `.pb-chip` con clase `current`, barra de progreso `--` relativa al máx |
| `renderPanels()` | 984–990 | Filas `.sp` de puntaje |

### Tutorial y UI (L992–1031)
| Función | Línea | Qué hace |
|---|---|---|
| `TUT` (array) | 994–1003 | 8 pasos de texto |
| `startTut()` | 1004 | Configura partida demo (2 jugadores, 3 rondas) con tutorial |
| `showTut()` / `tutNext()` | 1013–1021 | Navegación de pasos; al terminar → `startG()` |
| `showS(id)` | 1024 | Cambia pantalla activa (clase `.active`) |
| `setMsg(m)` / `showRules()` / `hideRules()` / `sleep(ms)` | 1025–1028 | Utilidades |
| Init `renderPS(2)` | 1031 | Prepara menú al cargar |

---

## 5. PUNTOS DE EXTENSIÓN VISUAL (cambiar LOOK sin tocar lógica)

### (a) Paleta `:root` — LÍNEAS **9–10** (¡ÚNICA fuente de panel/fondo/accent!)
- `--bg` (fondo), `--panel` (carteles), `--panel2` (round-badge), `--accent` (acento rojo actual — cambia TODO: botón primario, selecciones, glows, borde modal, texto CASCADE), `--text`, `--dim`.
- ⚠️ Los 6 colores `--red…--orange` de la L10 son SOLO decorativos en UI; los colores reales de celdas/pilas vienen de `COLORS` en JS (L258–261). Si el neón requiere re-mapear colores de juego → editar `COLORS` (cada `c:'#hex'`) y, por consistencia, `PCOL` (L263) y `showConfetti` (L847, array de colores).

### (b) Celdas y pilas (apariencia de hexágonos) — LÍNEAS **56–71**
- `.hex-cell` (56–58): tamaño (64×56), clip-path hexagonal, fondo/borde por defecto. El color REAL llega por atributo inline del JS (renderBoard L915–916) — no sobrescribir `background` con `!important` en `.hex-cell` sin ajustar también renderBoard.
- `.hex-cell.empty` (61): look de celda vacía (para glow neón de casillas disponibles).
- `.stack-vis` / `.stack-layer` / `.hex-count` (62–65): forma, grosor y radio de las capas de pila (alto lo fija inline el JS en L929: `layerH` 5px normal / 3px si >6 capas).
- Animaciones `clearing/merging/merge-from` (66–71), `valid-target` (88): **no alargar duraciones** (sincronizadas con sleeps de 800/1200ms en JS).

### (c) Pool — LÍNEAS **92–102**
- `.pool-stack` (fondo, borde, radius, hover glow) y `.pool-stack.selected` (glow + checkmark ✓) / `.used` (desvanecido). Capas `.ps-layer` (101) con alto inline del JS (renderPool L960–961).

### (d) Menú — LÍNEAS **15–21, 26–39**
- `#menu h1` (16–18): gradiente/brillo del título (cambiar `linear-gradient(...)` y `shimmer` para neón); `.sub` (19); `.ms` (20–21) carteles; botones `.btn-p`/`.btn-s` (27–32); `.cbtn.on` (35) y `.pcb label:has(input:checked)` (38) — selecciones.
- `body` L11: fondo general (además de `--bg`).

### (e) Fin de partida: ranking y confeti — LÍNEAS **143–153**
- `#end h1` (143), `.end-rank` (144–146) tarjetas + corona del ganador `.end-rank.w::before` (146), `.er-pos/.er-name/.er-score` (147–149), `.confetti`/`confettiFall` (152–153) — formas/giro de confeti. Colores del confeti si se necesita otro set: JS L847.

### (f) Fuentes — dos toques exactos
1. **Agregar `<link>` de Google Fonts** justo después de la línea **5** (`<meta name="viewport" ...>`) y antes de `<title>`/`<style>` (ej.: `<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">`).
2. **Aplicarla en `body`** en la línea **11**: `body{font-family:'Orbitron','Segoe UI',system-ui,sans-serif;...}` y/o en `#menu h1`, `.round-badge`, `.pb-chip`, `.score-pop`, `.cascade-text` para acentos display.

### Otras palancas visuales seguras
- Fondo de pantallas: `#game`/`#menu` heredan `body`; se puede añadir un `background` propio por `screen` (pseudo-elements, radial-gradients) sin tocar JS.
- Media query móvil (156–171) si los nuevos tamaños de celda rompen el layout pequeño.
- Pseudo-elementos existentes para decorar sin HTML nuevo: `.pool-stack::after` (94, ya preparado para glow), `.btn-p::after` (28).

---

## 6. RIESGOS — LO QUE **NO** DEBE TOCAR EL IMPLEMENTADOR

### Bloqueado por completo (lógica pura)
- `placeStack` L435–582 (merge/cascada/desaparición/scoring), `evalPlacement` L735–843 (IA hard incluye simulación), `generatePool` L339, `nextRound`/`startTurn` L364–401, `boardLockPenalty` L694, `endGame`/`showConfetti` L846–884, `renderBoard`/`renderPool`/`renderPlayerBar` L901–990 en su lógica de generación de HTML (solo se pueden ajustar **estilos inline** con muchísimo cuidado — prefiero que se deje como está y se trabaje por CSS).
- Constantes: `COLORS` (258), `PCOL` (263), `ROWS` (266), `ADJ` (268), `THRESHOLD` (290), `TUT` (994).
- Estructura `G` (293–297): `board[i].stack` (array de strings de color, tope = último), `pool[i]` {layers,height}, `poolUsed`, `selectedPool`, `curP`, `rotationOffset`, `animating`, `over`, `phase`.

### IDs y atributos que el JS consulta ESCRITOS así (no renombrar, no eliminar)
- IDs: `menu`, `game`, `end`, `pcBtns`, `pSetup`, `hexBoard`, `poolWrap`, `playerBar`, `sidePanels`, `msg`, `roundBadge`, `turnInfo`, `endRank`, `rulesM`, `tutBg`, `tutBox`, `tutTx`, `tutBtn`.
- Atributo `data-ci` en `.hex-cell` (selectores L611, 622, 630, 667, 680) + `onclick="clickCell(N)"`.
- `onclick="selectPool(N)"` en `.pool-stack`; `onclick` en botones de menú (setPC/startG/startTut/showRules/hideRules/tutNext/showS).

### Clases que el JS agrega/quita (mantener su efecto o la jugabilidad se rompe visualmente)
- Pantallas: `active` (`.screen.active` L12 — si se rompe, no cambia la pantalla).
- Menú: `on` en `.cbtn` (L301).
- Tablero: `empty`, `locked`, `valid-target`, `clearing`, `merging`, `merge-from`, `merge-arrow`; `.hex-board.shake`.
- Pool: `used`, `selected`.
- Barra: `current` en `.pb-chip`.
- End: `w` en `.end-rank`.
- Modales/tutorial: `show` en `.modal-bg`, `.tut-bg`, `.tut-box`; `.merge-dot.animate`.

### Sincronía animación ↔ lógica (el error clásico)
- JS hace `await sleep(...)` con **300 ms** (L447), **1200 ms** (L542, L562) y clases de animación de **800 ms** (L612, `clearPop`/`mergeGlow` 0.8s). **No alargar** `@keyframes` ni `transition` de `.hex-cell`/`.stack-layer` más allá de ~1.2s ni cambiar los tiempos de las clases `.clearing/.merging/.merge-from` (66–71) sin ajustar esos `sleep`, o los efectos se ven truncados/desincronizados.
- `.hex-cell` transiciones (L57): `background .6s, border-color .6s` — subir mucho esto hace lentos los renderAll posteriores a merges.
- El texto/color de `.cascade-text` y `.score-pop` se inyectan con `var(--accent)` L661, L688: si se redefine `--accent` en `:root`, se actualizan solos. ✅

### Duplicidad de colores (fuente nº1 de inconsistencias)
- Aunque cambies toda la paleta `:root` (L9–10), **celdas, capas de pila, dots de merge y confeti seguirán con los colores hardcodeados del JS** (`COLORS` L258–261, `PCOL` L263, confeti L847). Para un re-estilo coherente: definir el set neón en `COLORS` Y espejarlo en `:root` (y en `PCOL` para jugadores).
- Los nombres internos de color (`red/blue/green/yellow/purple/orange`) NO deben renombrarse (se usan como claves de `COLORS` y como valores dentro de `G.board[i].stack` → renombrar rompe merges).

### Otros
- No tocar `<meta viewport>` (L5) ni el orden de los bloques CSS (media query debe quedar al final del `<style>`).
- Si se agregan fuentes externas, mantener fallbacks locales (`system-ui, sans-serif`) para que el juego funcione offline.
- Verificación estándar tras el re-estilo: abrir `index.html` en navegador → jugar una partida con IA fácil (flujo completo), verificar: selección de pila → resaltado `valid-target` → colocación → merge animado → desaparición con +pts → cambio de turno (orden rotado) → fin con confeti y ranking.