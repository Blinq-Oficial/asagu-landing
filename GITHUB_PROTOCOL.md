# 🔀 Protocolo de GitHub — Blinq Oficial

> ⚠️ **LECTURA OBLIGATORIA PARA AGENTES IA Y COLABORADORES:** Este documento define el flujo de trabajo de Git para este proyecto. Cualquier commit directo a `main` sin seguir este protocolo será revertido.

---

## Estructura de Ramas

Este proyecto utiliza un flujo de **dos ramas** permanentes:

| Rama | Propósito | Despliega a |
|------|-----------|-------------|
| `main` | **Producción.** Código estable y verificado. | Netlify (auto-deploy) |
| `develop` | **Desarrollo.** Trabajo en progreso y testing. | Local únicamente |

```
main ────●────────●────────●──── (producción en Netlify)
          \      /          \
develop ───●──●──●────●──●───●── (desarrollo activo)
```

---

## Reglas de Operación

### 1. Nunca trabajar directamente en `main`

Todo el desarrollo debe hacerse en la rama `develop`. La rama `main` solo recibe código a través de merges desde `develop` después de verificación local.

```bash
# Al iniciar una sesión de trabajo:
git checkout develop
git pull origin develop
```

### 2. Probar todo en local antes de mergear

Antes de enviar cualquier cambio a `main`, se debe verificar que:
- [ ] El sitio carga correctamente en el navegador local
- [ ] No hay errores en la consola del navegador
- [ ] Los formularios, botones y links funcionan
- [ ] El diseño se ve bien en móvil (375px) y desktop (1440px)

### 3. Flujo de Merge a Producción

Solo cuando el código está verificado localmente:

```bash
# 1. Asegurarse de estar en develop con todo commitado
git checkout develop
git add .
git commit -m "feat: descripción clara del cambio"
git push origin develop

# 2. Mergear a main
git checkout main
git pull origin main
git merge develop

# 3. Push a producción (Netlify desplegará automáticamente)
git push origin main

# 4. Volver a develop para seguir trabajando
git checkout develop
```

### 4. Formato de Mensajes de Commit

Usar [Conventional Commits](https://www.conventionalcommits.org/):

| Prefijo | Uso |
|---------|-----|
| `feat:` | Nueva funcionalidad o sección |
| `fix:` | Corrección de bug |
| `style:` | Cambios visuales (CSS, colores, layout) |
| `content:` | Actualización de textos o imágenes |
| `seo:` | Meta tags, OG, sitemap, robots |
| `chore:` | Mantenimiento, configs, dependencias |

Ejemplo: `feat: añadir sección de testimonios con carousel`

---

## Conexión con Netlify

La rama `main` está conectada directamente a Netlify. Cada push a `main` dispara un deploy automático:

```
git push origin main → Netlify detecta cambio → Build automático → Sitio actualizado
```

> [!CAUTION]
> **NUNCA hacer `git push origin main` sin haber verificado el sitio en local primero.** Un push roto = sitio en producción roto para el cliente.

---

## Emergencias: Hotfix en Producción

Si hay un bug crítico en producción que necesita arreglo inmediato:

```bash
# 1. Crear rama hotfix desde main
git checkout main
git checkout -b hotfix/descripcion-del-bug

# 2. Hacer el fix mínimo necesario
# ... editar archivos ...

# 3. Commit y merge directo a main
git add .
git commit -m "fix: descripción del arreglo urgente"
git checkout main
git merge hotfix/descripcion-del-bug
git push origin main

# 4. Sincronizar develop
git checkout develop
git merge main
git push origin develop

# 5. Limpiar
git branch -d hotfix/descripcion-del-bug
```

---

## Checklist Pre-Deploy

Antes de cada merge a `main`, verificar:

- [ ] Sitio funciona en local sin errores
- [ ] No hay `console.log()` o código de debug
- [ ] Las imágenes cargan correctamente
- [ ] Los links internos y externos funcionan
- [ ] El responsive se ve bien (mobile + desktop)
- [ ] Los formularios envían correctamente

---

*Documento mantenido por el equipo Blinq. Última actualización: Agosto 2026.*
