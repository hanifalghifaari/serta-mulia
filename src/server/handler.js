const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const storeData = require('../services/storeData'); // Tambahkan import storeData

async function postPredictHandler(request, h) {
  const { image } = request.payload;
  const { model } = request.server.app;

  // Prediksi menggunakan model
  const { confidenceScore, label, explanation, suggestion } = await predictClassification(model, image);
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Data yang akan disimpan
  const data = {
    id,
    result: label,
    explanation,
    suggestion,
    confidenceScore,
    createdAt
  };

  // Simpan data ke storage (tambahkan pemanggilan storeData)
  await storeData(id, data);

  // Kirim response
  const response = h.response({
    status: 'success',
    message:
      confidenceScore > 99
        ? 'Model is predicted successfully.'
        : 'Model is predicted successfully but under threshold. Please use the correct picture',
    data
  });
  response.code(201);
  return response;
}

module.exports = postPredictHandler;
