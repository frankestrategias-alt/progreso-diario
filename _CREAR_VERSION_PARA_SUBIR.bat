@echo off
echo ==========================================
echo      CREANDO NUEVA VERSION DE LA APP
echo ==========================================
echo.
echo Por favor espera unos segundos...
echo (No cierres esta ventana hasta que termine)
echo.

call npm run build

echo.
echo ==========================================
echo        LISTO! CARPETA 'DIST' ABIERTA
echo ==========================================
echo.
echo Ahora arrastra la carpeta 'dist' a Netlify.

explorer dist

pause
