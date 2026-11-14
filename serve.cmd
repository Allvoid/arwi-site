@echo off
rem Local preview of the ArWi site: http://127.0.0.1:8417
cd /d "%~dp0"
start "" http://127.0.0.1:8417
python -m http.server 8417 --bind 127.0.0.1
