---
description: Cómo iniciar el servidor de desarrollo local y proporcionar el enlace
---

### Iniciar el Servidor de Desarrollo Local

Si el usuario solicita ver los cambios en local o iniciar el servidor, sigue estos pasos:

1. Asegúrate de estar en el directorio raíz del proyecto.
2. Ejecuta el comando de inicio de Vite usando `cmd /c` para evitar problemas con las políticas de ejecución de PowerShell:
   ```powershell
   cmd /c "npm run dev"
   ```
3. Una vez que el servidor esté activo (normalmente en el puerto 3000), proporciona al usuario un enlace directo clicable en formato Markdown:
   ```markdown
   👉 **[ABRIR APP EN LOCAL](http://localhost:3000/)**
   ```
4. Siempre responde en **Español** (Castellano/Natural) siguiendo la preferencia del usuario.
