@echo off
cd /d "%~dp0"
echo ========================================================
echo   SAMS ERP - Student Attendance Management System
echo   RTK Multi-Slice Architecture + Composite-Key Dedup
echo ========================================================
echo Starting Vite Dev Server...
call npm.cmd run dev -- --host
