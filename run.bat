@echo off
if "%1" == "back" (
    cd backend
    .venv\Scripts\activate
    py manage.py runserver
) else if "%1" == "front" (
    cd frontend
    pnpm run dev
) else (
    echo Uso: "run [back|front]"
)