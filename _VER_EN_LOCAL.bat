@echo off
echo =======================================================
echo          VER TU APP EN TIEMPO REAL (LOCAL)
echo =======================================================
echo.
echo 1. Este comando abrira un servidor en tu computadora.
echo.
echo 2. Cualquier cambio que yo haga en el codigo se vera
echo    reflejado al instante aqui.
echo.
echo =======================================================
echo.
echo ... INICIANDO SERVIDOR ...
echo (NO CIERRES ESTA VENTANA MIENTRAS PRUEBAS)
echo.
call npm run dev -- --host
pause
