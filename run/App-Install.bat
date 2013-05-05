@echo off

cd ./../
call gem -v /k || (cls && echo You need Ruby to install SASS + Compass. Please install now from http://rubyinstaller.org/ && pause && cd ./run/ && start App-Install.bat && exit)
::cls
echo .
echo .
echo ==== Great, you have RUBY. Test if you have compass...
echo .
echo .

call compass -v || (gem install compass)
::cls
echo .
echo .
echo ==== Good! Now you have COMPASS on your machine. And NODE.JS, do you have?
echo .
echo .

call node -v || (echo You need NODE.JS installed on your computer. Install now from http://nodejs.org/ && pause && start App-Install.bat && exit)
::cls
echo .
echo .
echo ==== Congratulations! You have the NODE.JS installed. And finally install the project...
echo .
echo .

call npm install
::cls
echo .
echo .
echo ==== Thank-you! Your project is ready to go. Bye bye...
echo .
echo .

pause