# HexaSort Party v2 — Referencias Visuales y Dirección Artística

**Proyecto:** Juego de merges en tablero hexagonal compartido (19 hexágonos, layout 3-4-5-4-3), 2-4 jugadores: pilas de colores, merges por adyacencia del mismo color, cascadas en cadena, desaparición con ≥10 hexágonos, turnos rotativos, pool de 3 pilas.

**Nivel de calidad objetivo:** Comercial (referentes: Royal Match, Candy Crush, Toon Blast, Hex FRVR, Block Blast, Gardenscapes).

**Imágenes de referencia:** 15 capturas reales descargadas en `imagenes/` (ver tabla).

---

## 1. Tabla de Referencias Visuales

| # | Archivo | Juego | Qué muestra | Estilo | Características de UI |
|---|---------|-------|-------------|--------|------------------------|
| 01 | `01_royal-match_tablero_king.png` | Royal Match | Tablero de puzle "Save the King" con iconos brillantes (coronas, gemas) y cámara del rey | **Light** — claro, rico, brillante | Marco dorado brillante con filetes blancos; iconos con brillo 3D cartoon; fondo de ladrillo claro; banner inferior azul oscuro con texto blanco redondeado |
| 02 | `02_royal-match_tablero_shark.png` | Royal Match | Tablero de evento con temática tiburón | **Light** — claro, rico, dorado | Piezas saturadas (rojo, lima, amarillo dorado); marco dorado premium; fondos temáticos animados; jerarquía clara de piezas/obstáculos |
| 03 | `03_royal-match_menú_evento_cofres.png` | Royal Match | Menú de evento con cofres y recompensas | **Light** — dorado/premium | Cofres 3D con brillos; botones dorados con gradiente; elementos de recompensa con contornos oscuros; jerarquía de ofertas clara |
| 04 | `04_toon-blast_tablero_dungeon.png` | Toon Blast | Tablero estilo mazmorra con oso protagonista y guante tutorial | **Light medio** — cartoon 3D brillante | Cubos con esquinas redondeadas (filleted); sombras suaves ambient occlusion; colores primarios saturados (cian, amarillo, lima); cursor-mano cartoon gigante |
| 05 | `05_toon-blast_tablero_bolas.png` | Toon Blast | Tablero con bolas/cubos de colores | **Light medio** — cartoon brillante | Bloques 3D plastificados; saturación alta; formas volumétricas simplificadas; fondo temático estilizado |
| 06 | `06_toon-blast_tablero_trampas.png` | Toon Blast | Tablero con trampas/obstáculos especiales | **Light medio** — cartoon | Elementos especiales con animación sugerida; iconos grabados en los bloques; contraste interactivo vs entorno |
| 07 | `07_hex-frvr_tablero_hex_dark.png` | Hex FRVR | Tablero hexagonal real — el más relevante para la mecánica | **Dark** — minimalista flat | Negro profundo de fondo; hexágonos pastel mate (melocotón, limón, menta, rosa, lavanda); hexágonos vacíos en gris oscuro sutil; estética puramente geométrica; estilo "easy to learn" |
| 08 | `08_hex-frvr_tablero_hex_light.png` | Hex FRVR | Tablero hexagonal en variante clara | **Light** — minimalista flat | Misma geometría hexagonal limpia; fondo claro; piezas planas con sombreado sutil; sin texturas complejas |
| 09 | `09_block-blast_menu_titulo.png` | Block Blast | Menú principal con título | **Moderno plano** — light | Tipografía display grande y redondeada; layout limpio tipo app moderna; botones planos con colores sólidos |
| 10 | `10_block-blast_tablero_hud.png` | Block Blast | Tablero con HUD (puntuación, vidas, niveles) | **Moderno plano** | HUD compacto arriba; colores sólidos planos; contadores legibles; estilo minimalista contemporáneo |
| 11 | `11_block-blast_tablero_efectos.png` | Block Blast | Tablero con efectos de explosión/merge | **Moderno plano** | Efectos de partículas/explosión visibles; feedback de éxito inmediato; brillos sobre piezas |
| 12 | `12_candy-crush_tablero_hud_explosion.png` | Candy Crush | Tablero con HUD y explosión en curso | **Pastel brillante** — light | Piezas con brillo y relieve glossy; explosión con destellos; HUD con barra de progreso de nivel |
| 13 | `13_candy-crush_arte_promocional_hud.png` | Candy Crush | Arte promocional + HUD | **Pastel brillante** | Personajes dulces (osos, animales); fuentes curvas tipo caramelo; degradados cálidos; sensación golosa |
| 14 | `14_gardenscapes_escena_gestion.png` | Gardenscapes | Escena de gestión/jardín narrativo | **Cálido narrativo** — light | Fondo escenográfico cálido y detallado; personajes expresivos; colores tierra + acentos vivos |
| 15 | `15_homescapes_puzzle_narrativo.png` | Homescapes | Puzle con narrativa de personaje | **Cálido narrativo** | Combinación de tablero + escena narrativa; personaje en primer plano; paleta cálida acogedora |

**Lectura clave para HexaSort Party v2:** la referencia más importante es `07_hex-frvr_tablero_hex_dark.png` (misma mecánica hexagonal) y `08` (variante clara). Royal Match (`01`-`03`) marca el estándar de "premium/festivo" en HUD y menús. Toon Blast (`04`-`06`) marca el estándar de "feedback jugoso" (efectos, personajes, tutorial). Block Blast (`09`-`11`) es el referente de UI moderna plana. Candy Crush (`12`-`13`) y Gardenscapes/Homescapes (`14`-`15`) aportan calidez y narrativa.

---

## 2. Direcciones Artísticas Sugeridas

### Dirección A — "NEÓN OSCURO" (Hex FRVR dark + moderno)
Tablero protagonista sobre fondo muy oscuro; neones saturados que hacen resaltar las pilas y las cascadas. Ideal para sesiones largas (menos fatiga visual) y para que las cadenas de merges "brillen".

**Paleta:**
| Rol | Color | Hex |
|-----|-------|-----|
| Fondo | Azul-negro profundo | `#0B0F1A` |
| Superficie (hex vacíos / tablero) | Gris-azul oscuro | `#1E2433` |
| Acento 1 (pilas) | Rosa neón | `#FF5C8A` |
| Acento 2 (pilas) | Menta neón | `#4DE3C1` |
| Éxito / merge | Amarillo dorado | `#FFD166` |
| Texto / UI | Blanco hueso | `#F4F6FB` |

**Fuentes (Google Fonts):** `Baloo 2` (títulos y números de pila — redondeada y legible) + `Nunito` (UI/cuerpo).

**Respaldo en la lista:** `07_hex-frvr_tablero_hex_dark` (base directa), `11_block-blast_tablero_efectos` (efectos sobre piezas), `12_candy-crush_tablero_hud_explosion` (feedback de explosión). Variante clara disponible si se prefiere: `08_hex-frvr_tablero_hex_light`.

---

### Dirección B — "PASTEL BRILLANTE" (Candy Crush / Royal Match)
Fondo claro y cálido, piezas dulces y brillantes con relieve glossy. El estándar del casual premium masivo: invita al toque, transmite recompensa. Ideal si el público objetivo es casual amplio.

**Paleta:**
| Rol | Color | Hex |
|-----|-------|-----|
| Fondo | Crema cálido | `#FFF3E0` |
| Superficie (tablero) | Beige/arena | `#FFE9C7` |
| Acento 1 (pilas) | Rosa fresa | `#FF6B9D` |
| Acento 2 (pilas) | Menta dulce | `#7ED9C4` |
| Éxito / merge | Dorado brillante | `#FFC94D` |
| Texto | Marrón chocolate | `#6B4E3A` |

**Fuentes (Google Fonts):** `Fredoka` (títulos — redondeada y golosa) + `Nunito` (UI).

**Respaldo en la lista:** `01_royal-match_tablero_king`, `02_royal-match_tablero_shark`, `03_royal-match_menú_evento_cofres`, `12_candy-crush_tablero_hud_explosion`, `13_candy-crush_arte_promocional_hud`, `14_gardenscapes_escena_gestion`, `15_homescapes_puzzle_narrativo`.

---

### Dirección C — "CARTOON VIVO" (Toon Blast)
Fondo de color medio, piezas 3D cartoon con esquinas redondeadas, sombras marcadas y colores máximamente saturados. El estándar de "juice": cada merge se siente como una celebración. Ideal para el modo multijugador party (impacto visual en pantalla compartida).

**Paleta:**
| Rol | Color | Hex |
|-----|-------|-----|
| Fondo | Azul medio vibrante | `#3E4FA3` |
| Superficie (tablero) | Azul profundo | `#2E3E8C` |
| Acento 1 (pilas) | Rojo coral | `#FF3D5A` |
| Acento 2 (pilas) | Cian eléctrico | `#2BD9FF` |
| Éxito / merge | Amarillo sol | `#FFD23F` |
| Texto | Blanco puro (con contorno oscuro) | `#FFFFFF` |

**Fuentes (Google Fonts):** `Bangers` o `Luckiest Guy` (títulos — display cómic con impacto) + `Baloo 2` (UI/números).

**Respaldo en la lista:** `04_toon-blast_tablero_dungeon`, `05_toon-blast_tablero_bolas`, `06_toon-blast_tablero_trampas`, `09_block-blast_menu_titulo`, `10_block-blast_tablero_hud`, `11_block-blast_tablero_efectos`.

---

### Recomendación de decisión
1. **Base visual recomendada:** Dirección A (Neón Oscuro) con la geometría hexagonal de Hex FRVR — es la única de las tres directamente validada para la mecánica de hexágonos en tablero compartido, y el fondo oscuro hace que las cascadas y el modo multijugador destaquen.
2. **Capas de "juice" (feedback) tomadas de la Dirección C:** partículas de merge, squash & stretch, screen shake sutil.
3. **HUD y menús tomados de la Dirección B:** marcos dorados, botones con gradiente y relieve, tipografía redondeada.

---

## 3. Assets con Licencia Comercial Verificada

> **Regla aplicada:** solo se incluyen assets cuya licencia fue verificada en la fuente. Preferencia CC0 y OFL. Si la licencia no pudo verificarse → excluido.

### Efectos de sonido (SFX)

| Tipo | Nombre | Licencia EXACTA | URL directa | Uso |
|------|--------|-----------------|-------------|-----|
| SFX UI | Kenney UI Audio Pack (Kenney UI SFX) | **CC0 1.0 Universal** (política CC0 de Kenney para todo su contenido) | https://kenney.nl/assets/ui-audio | Clicks de botón, hover, confirmar, cancelar, turno |
| SFX moneda | Coin Sounds (OpenGameArt) | **CC0 1.0** (confirmado por verificación previa) | https://opengameart.org/content/coin-sounds | Recompensas, puntos de merge |
| SFX pop | "Bang, Pop" — DigitalDominic (Freesound 178474) | **CC0 1.0** (verificado en la página) | https://freesound.org/s/178474/ | Pop de pila colocada |
| SFX pop | "Bubble Wrap Pop" — thedapperdan (Freesound 199924) | **CC0 1.0** (verificado en la página) | https://freesound.org/s/199924/ | Cascada de pops en cadena |
| SFX pop | "Pop sound" — deraj (Freesound 202230) | **CC0 1.0** (verificado en la página) | https://freesound.org/s/202230/ | Merge individual |
| SFX pop | "Cartoon Pop (Distorted)" — unfa (Freesound 245646) | **CC0 1.0** (verificado en la página) | https://freesound.org/s/245646/ | Merge grande / desaparición de 10+ |

> ⚠️ Nota del sonido 245646 (unfa): el autor declara que **no autoriza el uso de sus sonidos para entrenar modelos generativos de ML** — esto NO afecta su uso dentro del juego comercial, solo el reentrenamiento de IA. Sin restricción para el proyecto.

> ⚠️ **EXCLUIDO:** `https://opengameart.org/content/impact-sounds` — la URL devuelve **404** y la licencia no pudo verificarse. No incluido. (Alternativa válida: los pops de Freesound de arriba cubren el mismo rol de "impacto".)

### Tipografía (Google Fonts — todas bajo SIL Open Font License 1.1, apta uso comercial sin atribución)

| Tipo | Fuente | Licencia EXACTA | URL directa | Uso |
|------|--------|-----------------|-------------|-----|
| Display/Títulos | Baloo 2 | **SIL OFL 1.1** | https://fonts.google.com/specimen/Baloo+2 | Títulos, números de pila (Dir. A y C) |
| Display/Títulos | Fredoka | **SIL OFL 1.1** | https://fonts.google.com/specimen/Fredoka | Títulos dulces (Dir. B) |
| Display/Títulos | Bangers | **SIL OFL 1.1** | https://fonts.google.com/specimen/Bangers | Títulos cómic (Dir. C) |
| Display/Títulos | Luckiest Guy | **SIL OFL 1.1** | https://fonts.google.com/specimen/Luckiest+Guy | Títulos cómic (Dir. C) |
| UI/Cuerpo | Nunito | **SIL OFL 1.1** | https://fonts.google.com/specimen/Nunito | Texto UI, botones, tutorial (todas las direcciones) |

### Iconografía

| Tipo | Nombre | Licencia EXACTA | URL directa | Uso |
|------|--------|-----------------|-------------|-----|
| Iconos | game-icons.net | **CC BY 3.0** — requiere **atribución** en créditos del juego | https://game-icons.net | Iconos de HUD, botones, efectos (gemas, cofres, rayos, etc.) |

### Resumen de estados

| Asset | Estado |
|-------|--------|
| Kenney UI Audio Pack | ✅ CC0 — verificado (política oficial Kenney) |
| Coin Sounds (OGA) | ✅ CC0 — verificado por agente anterior |
| Freesound 178474 / 199924 / 202230 / 245646 | ✅ CC0 — verificados en esta sesión (marca `zero/1.0/` en página oficial) |
| Google Fonts (Baloo 2, Fredoka, Bangers, Luckiest Guy, Nunito) | ✅ OFL 1.1 |
| game-icons.net | ✅ CC BY 3.0 (con atribución) |
| impact-sounds (OGA) | ❌ Excluido — URL 404, licencia no verificable |

---

*Reporte generado el 17/08/2026. Imágenes verificadas en disco: 15/15. Ningún asset descargado — solo verificación de licencias.*
