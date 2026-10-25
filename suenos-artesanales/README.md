# Sueños Artesanales — tienda y panel (Firebase Spark + Netlify)

Esta guía está escrita para alguien que no programa. Seguila en orden.

## Palabras que vas a ver
- **Repositorio**: una carpeta en GitHub donde se guarda el código.
- **Commit**: guardar un "punto de control" de los cambios con un mensaje.
- **Build**: el paso que Netlify hace antes de publicar (aquí, crear el archivo con tus datos de Firebase).
- **Variables de entorno**: datos de configuración que se cargan en Netlify, sin escribirlos en el código.
- **Reglas de seguridad**: las que deciden quién puede leer y escribir en la base de datos.

## 1. Qué archivos contiene
- `public/index.html`: tienda (catálogo, carrito, pedido por WhatsApp).
- `public/custom.html`: pedidos personalizados. `public/fiestas.html`: fechas festivas y trabajos realizados.
- `public/admin.html`: panel (pedidos, productos, ajustes). `quotes.html` (cotizaciones y PDF), `agenda.html` (calendario), `manual.html` (pedido manual y solicitudes), `content.html` (campañas y galería).
- `public/theme.css`, `public/img/` y `docs/MANUAL_DE_MARCA.md`: estética provisoria derivada del logo.
- `firestore.rules`: reglas de seguridad. `netlify.toml` y `scripts/build.js`: publicación. `.env.example`: lista de variables. `.gitignore`.

## 2. Qué necesitás
Una cuenta de Google (Firebase), una de GitHub y una de Netlify. Todas gratuitas. **No** cargues tarjeta de crédito: si algún sitio la pide, no sigas (mantené el plan Spark de Firebase).

## 3. Extraer el ZIP
Clic derecho sobre `suenos-artesanales.zip` → "Extraer todo". Quedará la carpeta `suenos-artesanales`.

## 4. Crear el proyecto en Firebase
Entrá a https://console.firebase.google.com → **Agregar proyecto** → poné un nombre → podés desactivar Google Analytics → **Crear proyecto**.

## 5. Activar Firestore
Menú **Compilación (Build) → Firestore Database → Crear base de datos** → elegí una ubicación cercana → modo **producción** → Habilitar.

## 6. Activar Authentication
**Compilación → Authentication → Comenzar → Correo electrónico/contraseña → Habilitar → Guardar**.

## 7. Registrar la app web
En la página principal del proyecto, clic en el ícono **`</>`** (Web) → poné un apodo → **Registrar app**. **No** actives Firebase Hosting.

## 8. Dónde está la configuración de Firebase
Te muestra un bloque con `apiKey`, `authDomain`, `projectId` y `appId`. Copiá esos cuatro valores (después los encontrás en ⚙️ Configuración del proyecto → "Tus apps"). Son datos públicos; lo que protege tus datos son las reglas.

## 9. Variables de entorno
Se cargan en Netlify (paso 15): `FIREBASE_API_KEY`, `FIREBASE_AUTH_DOMAIN`, `FIREBASE_PROJECT_ID`, `FIREBASE_APP_ID`.
Para probar en tu computadora, creá `public/config.js` con: `window.FIREBASE_CONFIG = {apiKey:"...",authDomain:"...",projectId:"...",appId:"..."};` (ese archivo no se sube a GitHub).

## 10. Crear el primer administrador
1. Authentication → pestaña **Usuarios → Agregar usuario**: poné tu correo y una contraseña **segura propia**.
2. Copiá el **UID** de ese usuario.
3. Firestore → **Iniciar colección** → ID `admins` → ID de documento = **el UID** → agregá un campo `active` (booleano) = `true` → Guardar.
Nadie puede hacerse administrador desde la web: ese documento solo se crea a mano acá.

## 11. Aplicar las reglas de seguridad
Firestore → pestaña **Reglas** → borrá todo → pegá el contenido de `firestore.rules` → **Publicar**. Repetí esto cada vez que recibas una versión nueva de ese archivo.

## 12. Subir a GitHub
Creá un repositorio nuevo en https://github.com (botón **New**), vacío. Subí el contenido de la carpeta `suenos-artesanales` (si usás la web: "uploading an existing file", arrastrá los archivos y carpetas).

## 13. Un único commit
Si usás la terminal dentro de la carpeta: `git init`, `git add .`, `git commit -m "Proyecto completo Sueños Artesanales"`, `git branch -M main`, `git remote add origin <URL del repo>`, `git push -u origin main`. Si subís por la web de GitHub, todo el lote se guarda como un único commit.

## 14. Conectar GitHub con Netlify
https://app.netlify.com → **Add new site → Import an existing project → GitHub** → elegí el repositorio.

## 15. Build y variables
Netlify toma `netlify.toml` solo (comando `node scripts/build.js`, carpeta `public`). Antes de publicar: **Site configuration → Environment variables → Add a variable**, cargá las cuatro del paso 9.

## 16. Publicar
**Deploy site**. Cuando termine, abrí el enlace `.netlify.app`. En Firebase → Authentication → Settings → **Dominios autorizados**, agregá ese dominio.

## 17. Probar pedidos, WhatsApp y PDF
1. Entrá a `/admin.html`, iniciá sesión y creá un producto **publicado** con precio.
2. En la tienda, agregalo al carrito y confirmá con nombre y teléfono: debe aparecer un número `SA-XXXXXXXX`, y luego abrirse WhatsApp con el mensaje (**el cliente tiene que tocar "enviar"**; el pedido ya quedó guardado).
3. En el panel, el pedido debe aparecer; definí el envío y probá "Imprimir / PDF" (en el cuadro de impresión elegí "Guardar como PDF").
4. Creá una cotización y probá su PDF. El PDF no se adjunta solo a WhatsApp: guardalo y envialo manualmente.

## 18. Errores comunes
- **"Faltan variables" al publicar**: falta cargar alguna del paso 9.
- **"Missing or insufficient permissions"**: no pegaste las reglas, o falta el documento en `admins`.
- **No entra al panel**: revisá el UID del paso 10 y el dominio autorizado del paso 16.
- **Productos que no se ven**: deben estar publicados y disponibles.
- **Imagen rechazada**: es demasiado grande; usá una más chica.

## 19. Comprobar que no se usa Firebase Storage
En Firebase, **Storage** no debe estar activado. En el código, buscá el texto `firebasestorage` o `storage` (debe dar 0 resultados). Las imágenes se guardan comprimidas dentro de Firestore.

## 20. Actualizar en el futuro sin perder datos
Los datos viven en Firestore, no en el código. Reemplazá archivos en GitHub y Netlify publica de nuevo solo. No borres colecciones. Si cambia `firestore.rules`, volvé a pegarlo (paso 11).

## Cuotas gratuitas
El plan Spark tiene límites diarios de lecturas, escrituras y almacenamiento de Firestore. **No verifiqué las cifras vigentes**: consultalas en https://firebase.google.com/pricing antes de lanzar. El proyecto limita lecturas (últimos 200 pedidos, 100 productos) y comprime imágenes (~150 KB) para cuidar la cuota.

## Lista final antes de anunciar la web
- [ ] Reglas publicadas y administrador creado. - [ ] Productos reales cargados y publicados.
- [ ] WhatsApp, valor hora y condiciones revisados en Ajustes. - [ ] Pedido de prueba hecho desde un celular.
- [ ] PDF de pedido y de cotización probados. - [ ] Dominio autorizado en Firebase. - [ ] Storage desactivado.

## Pruebas
**Hechas**: revisión de sintaxis JavaScript de todas las páginas; el script de build genera `config.js` con variables de ejemplo; búsqueda de texto de Firebase Storage en el código.
**Pendientes (requieren tu proyecto real)**: carga en navegador y celular, pedido real, mensaje de WhatsApp, PDF, reglas de Firestore (probalas en la pestaña "Reglas → Simulador"), calendario y recordatorios, protección del panel.

## Límites conocidos
- Las reglas no pueden recalcular totales; la tienda relee los precios y el administrador revisa cada pedido.
- Números de pedido: únicos y legibles pero aleatorios, no correlativos.
- Sin fotos de referencia en pedidos personalizados (se envían por WhatsApp).
- Los estados de pedido son fijos (no editables desde Ajustes todavía).
- Sin avisos automáticos con la app cerrada. Los PDF se generan con la impresión del navegador.
