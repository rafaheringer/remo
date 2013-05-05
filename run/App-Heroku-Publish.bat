@echo off
cd ..\

echo .
echo .
echo === Logando-se no sistema...
echo .
echo .

::call heroku login

echo .
echo .
echo === Publicando para o master...
echo .
echo .

call git push heroku master

echo .
echo .
echo === Iniciando servidor web...
echo .
echo .

call heroku ps:scale web=1

echo .
echo .
echo === Pronto! Iniciando versão web para testes.
echo .
echo .

call heroku open
pause