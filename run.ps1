Write-Host "🚀 Starting Assessment Recommendation Engine..." -ForegroundColor Cyan

# Set UTF-8 for emoji printing stability
$env:PYTHONUTF8 = 1

# Launch backend in a separate background window
Write-Host "`n1️⃣ Starting FastAPI Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit -Command `"`$env:PYTHONUTF8=1; cd backend; .\.venv\Scripts\uvicorn app.main:app --host 127.0.0.1 --port 8000`""

# Brief delay to give the backend time to load models and warm up
Write-Host "Waiting for API port to warm up..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Start frontend in the current console
Write-Host "`n2️⃣ Starting Next.js Frontend (Interactive)..." -ForegroundColor Green
cd frontend
npm run dev
