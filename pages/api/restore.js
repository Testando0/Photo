// Arquivo: pages/api/restore.js
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { imageUrl } = req.body;

  try {
    // Usando o modelo Real-ESRGAN (excelente para aumentar qualidade)
    const output = await replicate.run(
      "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
      {
        input: {
          image: imageUrl,
          scale: 2, // Aumenta a imagem em 2x (pode ser até 4)
          face_enhance: true, // Tenta melhorar rostos na imagem
        },
      }
    );

    res.status(200).json({ original: imageUrl, restored: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao processar imagem", error: error.message });
  }
}
