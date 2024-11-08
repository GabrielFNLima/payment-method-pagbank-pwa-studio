let PagSeguro = null;

export const loadPagSeguroScript = () => {
    return new Promise((resolve, reject) => {
        if (PagSeguro) {
            resolve(PagSeguro);
            return;
        }

        const existingScript = document.querySelector(
            "script[src='https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js']"
        );
        if (existingScript) {
            existingScript.onload = () => {
                PagSeguro = window.PagSeguro;
                resolve(PagSeguro);
            };
            return;
        }

        const script = document.createElement('script');
        script.src =
            'https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js';
        script.async = true;

        script.onload = () => {
            if (window.PagSeguro) {
                PagSeguro = window.PagSeguro;
                resolve(PagSeguro);
            } else {
                reject(new Error('PagSeguro SDK não carregou corretamente.'));
            }
        };

        script.onerror = () =>
            reject(new Error('Erro ao carregar o script do PagSeguro'));

        document.head.appendChild(script);
    });
};
