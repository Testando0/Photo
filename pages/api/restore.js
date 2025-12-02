import Replicate from "replicate";

// Inicializa o cliente Replicate usando a variável de ambiente SECRETA
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// A rota da API que está dando 404
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { imageUrl } = req.body;

  try {
    // Usando o modelo Real-ESRGAN
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 2, 
          face_enhance: true,
        },
      }
    );

    res.status(200).json({ original: imageUrl, restored: output });
  } catch (error) {
    // Se o Replicate falhar, mostra o erro.
    res.status(500).json({ message: "Erro ao processar imagem. O token pode estar inválido ou expirado.", error: error.message });
  }
}
