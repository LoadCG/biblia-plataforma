import urllib.request
import json
import os

# Repositório conhecido com a bíblia em português (ACF ou NVI ou AA).
# Vamos usar a versão Almeida Revisada Imprensa Bíblica (AA) ou Almeida Corrigida Fiel (ACF)
url = "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/pt_acf.json"
output_path = r"c:\Users\Cauan Gabriel\Documents\GitHub\biblia-plataforma\assets\biblia.json"

print("Baixando a Bíblia ACF completa...")
try:
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    
    print(f"Bíblia baixada com sucesso! Tamanho: {os.path.getsize(output_path) / (1024*1024):.2f} MB")
except Exception as e:
    print(f"Erro ao baixar: {e}")
