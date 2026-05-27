exports.handler = async function(event) {
  const piva = event.queryStringParameters?.piva;
  if (!piva || piva.length !== 11) {
    return { statusCode: 400, body: JSON.stringify({ error: "P.IVA non valida" }) };
  }

  try {
    // Prova vatcomply
    const res = await fetch(`https://api.vatcomply.com/vat?vat=IT${piva}`);
    const data = await res.json();
    if (data.valid && data.company_name) {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          ok: true,
          azienda: data.company_name,
          indirizzo: data.company_address || "",
        })
      };
    }

    // Fallback VIES
    const res2 = await fetch(`https://ec.europa.eu/taxation_customs/vies/rest-api/ms/IT/vat/${piva}`);
    const data2 = await res2.json();
    if (data2.valid && data2.name && data2.name !== "---") {
      return {
        statusCode: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          ok: true,
          azienda: data2.name,
          indirizzo: data2.address && data2.address !== "---" ? data2.address : "",
        })
      };
    }

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: "P.IVA non trovata nei registri" })
    };

  } catch (e) {
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ ok: false, error: "Servizio non disponibile" })
    };
  }
};
