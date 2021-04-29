curl https://shouldervis.chpc.utah.edu/stavis/csv.zip --output csv.zip
powershell.exe -NoP -NonI -Command "Expand-Archive '.\csv.zip' '.\csv\'"
del csv.zip
