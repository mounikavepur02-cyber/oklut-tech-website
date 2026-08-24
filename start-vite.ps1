$env:VITE_HOST = "true"
$process = Start-Process "npx" -ArgumentList "vite --host" -WorkingDirectory "C:\Users\mouni\.gemini\antigravity-ide\scratch\oklut tech\oklut-web" -PassThru -NoNewWindow
Start-Sleep -Seconds 5
Write-Host "Vite process started with ID: $($process.Id)"