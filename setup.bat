@echo off
REM =============================================================================
REM IELTS WriteBetter - Quick Setup Script (Windows)
REM =============================================================================
REM This script helps you set up the Gemini API key for the IELTS WriteBetter app
REM Run with: setup.bat
REM =============================================================================

setlocal enabledelayedexpansion

echo ========================================
echo   IELTS WriteBetter - Quick Setup
echo ========================================
echo.

REM Check if .env.local already exists
if exist .env.local (
    echo [WARNING] File .env.local da ton tai!
    echo.
    set /p "OVERWRITE=Ban co muon ghi de file hien tai khong? (y/n): "
    if /i not "!OVERWRITE!"=="y" (
        echo [OK] Da huy. File .env.local hien tai duoc giu nguyen.
        pause
        exit /b 0
    )
)

echo.
echo [STEP 1] Lay Gemini API Key
echo ----------------------------------------
echo 1. Truy cap: https://aistudio.google.com/app/apikey
echo 2. Dang nhap bang tai khoan Google
echo 3. Nhan 'Create API key'
echo 4. Sao chep API key
echo.

REM Prompt for API key
set /p "API_KEY=Nhap Gemini API Key cua ban: "

REM Validate API key
if "!API_KEY!"=="" (
    echo [ERROR] API key khong duoc de trong!
    pause
    exit /b 1
)

echo.
echo [STEP 2] Tao file .env.local
echo ----------------------------------------

REM Create .env.local file
(
echo # =============================================================================
echo # GEMINI API KEY
echo # =============================================================================
echo # API key for Google Gemini AI
echo # Get your key at: https://aistudio.google.com/app/apikey
echo GEMINI_API_KEY=!API_KEY!
echo.
echo # =============================================================================
echo # FIREBASE CONFIGURATION - Optional
echo # =============================================================================
echo # Uncomment and fill these if you want to use Firebase features
echo # NEXT_PUBLIC_FIREBASE_API_KEY=
echo # NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
echo # NEXT_PUBLIC_FIREBASE_PROJECT_ID=
echo # NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
echo # NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
echo # NEXT_PUBLIC_FIREBASE_APP_ID=
) > .env.local

echo [OK] Da tao file .env.local thanh cong!

REM Verify file was created
if exist .env.local (
    echo.
    echo [SUCCESS] Setup hoan tat!
    echo.
    echo [NEXT STEPS] Cac buoc tiep theo:
    echo ----------------------------------------
    echo 1. Cai dat dependencies (neu chua^):
    echo    npm install
    echo.
    echo 2. Khoi dong development server:
    echo    npm run dev
    echo.
    echo 3. Truy cap ung dung tai:
    echo    http://localhost:3000
    echo.
    echo [DONE] Tat ca tinh nang AI gio da hoat dong!
    echo.
) else (
    echo [ERROR] Co loi xay ra khi tao file .env.local
    pause
    exit /b 1
)

REM Security reminder
echo.
echo [SECURITY] Luu y bao mat:
echo - File .env.local da duoc them vao .gitignore
echo - KHONG chia se API key cua ban voi nguoi khac
echo - KHONG commit file .env.local len Git/GitHub
echo.

pause
