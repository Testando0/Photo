import Replicate from "replicate";

const replicate = new Replicate({
  // Lê a variável de ambiente configurada no Vercel
  auth: process.env.REPLICATE_API_TOKEN, 
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const { imageUrl } = req.body;

  // Checagem de segurança se a chave não foi configurada no Vercel
  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ message: "Erro de Configuração: REPLICATE_API_TOKEN não está configurado nas variáveis de ambiente do Vercel." });
  }

  try {
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
    // Erro de comunicação com a IA do Replicate
    console.error(error);
    res.status(500).json({ message: `Erro da API de IA: ${error.message}. Verifique se seu token (${process.env.REPLICATE_API_TOKEN.substring(0, 5)}...) está válido.`, error: error.message });
  }
}
