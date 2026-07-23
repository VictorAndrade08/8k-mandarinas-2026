# Limpieza del proyecto — top 20 y registro · 22 de julio de 2026

Investigación pedida el 22-jul-2026: qué se puede borrar de un proyecto web,
de mejor a peor. Fuentes: GitHub Docs, Atlassian, git-filter-repo, y Reddit
(r/git, r/webdev — leído vía el archivo público PullPush). Al final, el
registro exacto de lo que se hizo en ESTE repo.

## El top 20, de mejor a peor

1. **`node_modules/` y salidas de build** (`.next/`, `out/`) — 100 %
   regenerables; causa #1 de repos gigantes. _Aquí: ya estaban ignorados._ ✅
2. **Archivos del sistema** (`.DS_Store`, `Thumbs.db`) — basura personal del
   SO; ignorar globalmente. _Aquí: borrados y ya ignorados._ ✅
3. **Secretos y `.env`** — nunca versionarlos; si un token tocó un commit,
   **rotarlo** (borrar no basta: queda en el historial). _Aquí: `.env.local`
   y `.dev.vars` ignorados; el token que se coló en `.claude/settings.json`
   se eliminó ANTES de subir — GitHub lo bloqueó y nunca salió._ ✅
4. **Los `.psd` de diseño** — binarios que Git no diffea; inflan `.git` para
   siempre. Archivar fuera, no destruir. _Aquí: `myairbridge-*/` (168 MB)
   movido a `Desktop/8k-material-fuente/`._ ✅
5. **Material de diseño descargado** — el repo es el producto, no el insumo.
   _Aquí: `nuevaslineasgraficas/` (116 MB) al archivo._ ✅
6. **Capturas de verificación** — artefactos de QA de un día; se regeneran
   con `scripts/capturas.mjs`. _Aquí: `capturas/` (92 MB) a la papelera._ ✅
7. **PDFs sueltos en la raíz** — clasificar: documentación viva → `docs/`;
   material recibido → archivo. _Aquí: `CRONO 8K.pdf` al archivo._ ✅
8. **Assets huérfanos en `public/`** — cada archivo se despliega; verificar
   referencias (incl. dinámicas) antes de borrar. _Aquí: barrido completo →
   0 huérfanos; 2 archivos raíz sin referencias (`Post-8K-*.jpeg`,
   `faviconmandarinas.png`) salieron del repo con copia en el archivo._ ✅
9. **`.gitignore` completo desde la plantilla oficial** — prevención. _Aquí:
   ya cubría psd/ai, material, capturas, env._ ✅
10. **`git rm --cached`** para des-trackear sin borrar del disco.
11. **Archivos generados por el build** — si `npm run build` lo produce, no
    se versiona. _Excepción deliberada aquí: las variantes @240w/@400w van
    al repo porque Cloudflare no corre sharp._
12. **Lockfiles duplicados** — uno solo (aquí: `package-lock.json`). ✅
13. **Cachés de herramientas** (`.wrangler/`, `coverage/`) — ignorar. ✅
14. **Copias "-old" y `backup/`** — Git ES el respaldo. _Aquí: no había._ ✅
15. **Logs** (`*.log`) — ruido regenerable; a veces filtran rutas o tokens.
16. **Purgar historial** (`git filter-repo`) — SOLO si `.git` pesa demasiado.
    Reescribe todos los SHAs: clon de respaldo antes, y coordinar.
17. **Medir antes de purgar**: `git count-objects -vH` y `git-sizer`.
18. **Git LFS** para binarios que sí deben versionarse (>100 MB no entran a
    GitHub sin LFS).
19. **Ramas mergeadas muertas** — `git branch --merged` y podar.
20. **Lo que NUNCA se borra**: `docs/*.md`, README, licencias, `.gitignore`,
    el lockfile activo, `_headers`/`wrangler.toml`, y el historial de Git.

## Registro de la limpieza (22-jul-2026)

| Qué                                 | Peso   | Destino                          |
| ----------------------------------- | ------ | -------------------------------- |
| `myairbridge-FLFnxKHTtTA/` (PSDs)   | 168 MB | `Desktop/8k-material-fuente/`    |
| `nuevaslineasgraficas/`             | 116 MB | `Desktop/8k-material-fuente/`    |
| `capturas/` (QA regenerable)        | 92 MB  | Papelera                         |
| `8K JULIO 2(1).mp4` (video fuente)  | 72 MB  | `Desktop/8k-material-fuente/`    |
| `CRONO 8K.pdf`                      | 4 MB   | `Desktop/8k-material-fuente/`    |
| `ChatGPT Image 16 jul….png`         | 1,5 MB | `Desktop/8k-material-fuente/`    |
| `Post-8K-MANDARINAS-4-5-2.jpg.jpeg` | 827 KB | fuera del repo, copia en archivo |
| `faviconmandarinas.png`             | 294 KB | fuera del repo, copia en archivo |
| `.DS_Store` (varios)                | —      | borrados                         |

**Resultado:** la carpeta del proyecto pasa de ~450 MB de material suelto a
solo código + assets usados. Nada se destruyó: todo el material fuente está
en `Desktop/8k-material-fuente/` (bórralo tú cuando confirmes que no hace
falta).

## Pendiente consciente: el `.git` pesa 717 MB

El historial guarda binarios de commits viejos. La cura es `git filter-repo`
(punto 16), pero reescribe TODOS los commits: clones y forks quedan
desincronizados. **Recomendación: no tocarlo antes de la carrera** — no
afecta al sitio ni al deploy, solo al peso del clon. Si después del 29 de
agosto molesta: respaldo completo primero, `git filter-repo` después.
