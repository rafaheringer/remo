@echo off

cd ./../
call grunt -h || (cls && echo You need Grunt running in your system. Please, execute: npm install grunt -g && exit)

cls
echo .
echo .
echo === Starting grunt....
echo .
echo .

call grunt deploy


echo .
echo .
echo === Done!
echo .
echo .

pause