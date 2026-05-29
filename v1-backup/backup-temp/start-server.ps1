
<#
.SYNOPSIS
Script chạy server local cho ClinicFlow (HTML/CSS/JS thuần)
.DESCRIPTION
Khởi động máy chủ HTTP local, mở trình duyệt tự động, kiểm tra Python, màu sắc đẹp
#>

# Màu sắc trong terminal
$Colors = @{
    Primary   = [ConsoleColor]::Cyan
    Success   = [ConsoleColor]::Green
    Warning   = [ConsoleColor]::Yellow
    Error     = [ConsoleColor]::Red
    Info      = [ConsoleColor]::Gray
}

# In logo ClinicFlow đẹp
function Write-Logo {
    Write-Host ""
    Write-Host "  ██████╗██╗  ██╗██╗███╗   ██╗██╗ ██████╗███████╗██╗      ██████╗ ██╗    ██╗" -ForegroundColor $Colors.Primary
    Write-Host " ██╔════╝██║  ██║██║████╗  ██║██║██╔════╝██╔════╝██║     ██╔═══██╗██║    ██║" -ForegroundColor $Colors.Primary
    Write-Host " ██║     ███████║██║██╔██╗ ██║██║██║     █████╗  ██║     ██║   ██║██║ █╗ ██║" -ForegroundColor $Colors.Primary
    Write-Host " ██║     ██╔══██║██║██║╚██╗██║██║██║     ██╔══╝  ██║     ██║   ██║██║███╗██║" -ForegroundColor $Colors.Primary
    Write-Host " ╚██████╗██║  ██║██║██║ ╚████║██║╚██████╗██║     ███████╗╚██████╔╝╚███╔███╔╝" -ForegroundColor $Colors.Primary
    Write-Host "  ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝╚═╝ ╚═════╝╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝ " -ForegroundColor $Colors.Primary
    Write-Host ""
    Write-Host "                     HỆ THỐNG ĐẶT LỊCH KHÁM BỆNH TRỰC TUYẾN                    " -ForegroundColor $Colors.Info
    Write-Host ""
}

# Kiểm tra xem Python đã cài chưa
function Test-PythonInstalled {
    try {
        $null = Get-Command python -ErrorAction Stop
        return $true
    }
    catch {
        Write-Host "[❌ LỖI] Python chưa được cài đặt!" -ForegroundColor $Colors.Error
        Write-Host "👉 Vui lòng cài Python từ: https://www.python.org/downloads/" -ForegroundColor $Colors.Info
        Write-Host "👉 Sau khi cài, chạy lại script này!" -ForegroundColor $Colors.Info
        return $false
    }
}

# Mở trình duyệt mặc định
function Open-Browser {
    param([string]$Url)
    Write-Host "[🔗 ĐANG MỞ] $Url" -ForegroundColor $Colors.Info
    try {
        Start-Process $Url
    }
    catch {
        Write-Host "[⚠️ CẢNH BÁO] Không mở được trình duyệt! Vui lòng mở thủ công: $Url" -ForegroundColor $Colors.Warning
    }
}

# Kiểm tra xem port đã được dùng chưa
function Test-PortAvailable {
    param([int]$Port)
    try {
        $listener = New-Object System.Net.Sockets.TcpListener("localhost", $Port)
        $listener.Start()
        $listener.Stop()
        return $true
    }
    catch {
        return $false
    }
}

# Chạy server chính
function Start-ClinicFlowServer {
    param([int]$Port = 8000)

    Clear-Host
    Write-Logo

    # Kiểm tra Python trước
    if (-not (Test-PythonInstalled)) {
        Read-Host "Nhấn Enter để thoát"
        return
    }

    # Kiểm tra port
    while (-not (Test-PortAvailable -Port $Port)) {
        Write-Host "[⚠️ CẢNH BÁO] Port $Port đã được dùng!" -ForegroundColor $Colors.Warning
        $Port = Read-Host "👉 Nhập port khác (vd: 8080, 3000, 5000...)"
        if (-not $Port) { $Port = 8000 } # Mặc định nếu bỏ trống
    }

    $serverUrl = "http://localhost:$Port"

    Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Primary
    Write-Host "✅ SERVER ĐANG CHẠY THÀNH CÔNG!" -ForegroundColor $Colors.Success
    Write-Host "📍 Địa chỉ server:  $serverUrl" -ForegroundColor $Colors.Success
    Write-Host "📂 Thư mục gốc:    $PWD" -ForegroundColor $Colors.Success
    Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor $Colors.Primary
    Write-Host "💡 Mẹo: Nhấn Ctrl + C để dừng server bất cứ lúc nào!" -ForegroundColor $Colors.Info
    Write-Host ""

    # Mở trình duyệt sau 1.5 giây để server kịp khởi động
    Start-Sleep -Milliseconds 1500
    Open-Browser -Url $serverUrl

    # Chạy HTTP server của Python (thuần, không cần thư viện ngoài)
    Write-Host "[🟢 ĐANG LẮNG NGHE] Yêu cầu trên port $Port..." -ForegroundColor $Colors.Primary
    Write-Host ""
    python -m http.server $Port
}

# Entry point: chạy server với port mặc định 8000
Start-ClinicFlowServer -Port 8000
