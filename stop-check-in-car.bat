@echo off
echo Parando o frontend na porta 2002...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :2002') do (
    echo Matando processo com PID %%a
    taskkill /PID %%a /F
)

