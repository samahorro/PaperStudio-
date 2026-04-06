Add-Type -AssemblyName System.IO.Compression.FileSystem

$backendPath = "backend"
$zipPath = "paperstudio-eb-final.zip"

if (Test-Path $zipPath) { Remove-Item $zipPath }

$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')

$exclude = @("node_modules", ".elasticbeanstalk", "*.zip", ".dockerignore", "Dockerfile", "backend.zip.zip")

Get-ChildItem -Path $backendPath -Recurse -File | ForEach-Object {
    $file = $_
    
    # Skip excluded items
    $skip = $false
    foreach ($ex in $exclude) {
        if ($file.FullName -like "*$ex*") { $skip = $true; break }
    }
    if ($skip) { return }

    # Create the entry path with forward slashes, relative to backend/
    $relativePath = $file.FullName.Substring((Resolve-Path $backendPath).Path.Length + 1)
    $entryPath = $relativePath.Replace("\", "/")
    
    $entry = $zip.CreateEntry($entryPath, [System.IO.Compression.CompressionLevel]::Optimal)
    $entryStream = $entry.Open()
    $fileStream = [System.IO.File]::OpenRead($file.FullName)
    $fileStream.CopyTo($entryStream)
    $fileStream.Close()
    $entryStream.Close()
    
    Write-Host "Added: $entryPath"
}

$zip.Dispose()
Write-Host "`nDone! Created: $zipPath"
