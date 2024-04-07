const _fetch = window.fetch;

window.fetch = async (...args): Promise<Response> => {
  const response = await _fetch(...args);

  if (typeof args[0] === 'string' && args[0].startsWith("api/recommendations")) {
    try {
      const jsonData: any = await response.clone().json();
      if (jsonData.result && jsonData.result.variations) {
        
        let fixed = false;
        jsonData.result.variations = jsonData.result.variations.map((variation: any) => {

          if (!variation.dimensions || Object.keys(variation.dimensions).length === 0) {
            variation.dimensions = { asin_no: variation.asin };
            fixed = true;
            return variation;
          }

          for (const key in variation.dimensions) {
            let modified = variation.dimensions[key]

            modified = modified
              .replace(/([^a-z0-9])$/i, '$1 \u200B')
              .replace(/:([^\s])/g, ': $1')
              .replace(/(\([^)]*\))([^\s])/g, '$1 $2');

            if (variation.dimensions[key] !== modified) {
              variation.dimensions[key] = modified;
              fixed = true;
            }
          }

          return variation;
        });

        if (fixed) {
          window.dispatchEvent(new CustomEvent('variationsFixed'));
        }
      }

      return new Response(JSON.stringify(jsonData), {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText        
      });

    } catch (error) {
      return response;
    }
  }

  return response;
};