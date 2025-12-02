import { useState } from "react";
import ReactCompareImage from "react-compare-image";
import Head from 'next/head'; // Importamos o Head para metadados específicos da página

export default function Home() {
  const [originalPhoto, setOriginalPhoto] = useState(null);
  const [restoredPhoto, setRestoredPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Limite máximo de upload em bytes (4MB) para evitar falhas no Vercel/Replicate
  const MAX_FILE_SIZE_MB = 4;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  // Função para lidar com o upload do arquivo
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setRestoredPhoto(null);

    // --- CHECAGEM DE TAMANHO ---
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`O arquivo é muito grande. O limite é de ${MAX_FILE_SIZE_MB}MB.`);
      return; 
    }
    // ---------------------------
    
    setLoading(true);
    
    // Converte a imagem para Base64 (Data URI)
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Image = reader.result;
      setOriginalPhoto(base64Image);

      try {
        // CHAMA A ROTA DA API: /api/restore
        const response = await fetch("/api/restore", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: base64Image }),
        });

        const data = await response.json();

        if (response.status !== 200) {
          setError(data.message || "Erro desconhecido da API. Verifique os logs do Vercel.");
        } else {
          setRestoredPhoto(data.restored[0]); // Pega o primeiro URL de resultado
        }
      } catch (err) {
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false);
      }
    };
  };

  return (
    <>
      <Head>
        <title>Restaurador de Fotos IA</title>
      </Head>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Restaurador de Fotos
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Transforme fotos borradas ou antigas em HD usando IA.
          </p>

          {/* O mesmo layout de upload */}
          {/* ... (O restante do código de layout que já enviamos permanece o mesmo) */}

          {/* Área de Upload */}
          {!originalPhoto && (
            <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 bg-gray-800 hover:border-blue-500 transition cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-xl font-medium">Clique ou arraste uma foto aqui</p>
                <p className="text-sm text-gray-500 mt-1">Máximo {MAX_FILE_SIZE_MB}MB</p>
              </div>
            </div>
          )}

          {/* Estado de Carregamento */}
          {loading && (
            <div className="mt-8 flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="animate-pulse text-blue-400">A Inteligência Artificial está trabalhando...</p>
            </div>
          )}

          {/* Exibição de Erro */}
          {error && (
            <div className="mt-4 p-4 bg-red-900/50 text-red-200 rounded-lg border border-red-700">
              {error}
            </div>
          )}

          {/* Resultado: Comparação Antes e Depois */}
          {originalPhoto && restoredPhoto && (
            <div className="mt-8 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
                <ReactCompareImage 
                  leftImage={originalPhoto} 
                  rightImage={restoredPhoto} 
                  sliderLineColor="#3B82F6"
                />
              </div>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => {
                    setOriginalPhoto(null); 
                    setRestoredPhoto(null);
                  }}
                  className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-full font-medium transition"
                >
                  Nova Foto
                </button>
                <a 
                  href={restoredPhoto} 
                  download="foto-melhorada.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-medium transition"
                >
                  Baixar Resultado
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
