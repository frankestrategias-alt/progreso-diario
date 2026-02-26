@echo off
echo =======================================================
echo          PRUEBA TU APP DESDE EL CELULAR
echo =======================================================
echo.
echo 1. Asegurate de que tu CELULAR y tu COMPUTADORA
echo    esten conectados al MISMO WI-FI.
echo.
echo 2. Abre el navegador de tu celular (Chrome o Safari).
echo.
echo 3. Escribe EXACTAMENTE esta direccion en la barra:
echo.
echo      http://192.168.1.2:3001
echo.
echo =======================================================
echo.
echo ... INICIANDO SERVIDOR VIRTUAL ...
echo (NO CIERRES ESTA VENTANA)
call npx vite --host
pause
