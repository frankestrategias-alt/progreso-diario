@echo off
echo ==========================================
echo      REPARANDO APLICACION
echo ==========================================
echo.
echo 1. Eliminando versiones viejas...
if exist node_modules rmdir /s /q node_modules
if exist dist rmdir /s /q dist
if exist package-lock.json del package-lock.json
echo.
echo 2. Instalando dependencias nuevas...
echo (Esto puede tardar unos minutos)
call npm install
echo.
echo 3. Construyendo aplicacion...
call npm run build
echo.
echo ==========================================
echo        PROCESO TERMINADO
echo ==========================================
echo.
echo Si ves la palabra "built in" arriba, todo salio bien.
echo Si ves errores en rojo, por favor copialos.
echo.
pause
