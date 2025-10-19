import React, { useState, useEffect, useCallback } from 'react';
import { 
  IP_DEFAULT_VIEW, 
  WHATSAPP_NUMBER, 
  WHATSAPP_MESSAGE,
  WHATSAPP_SUPPORT_NUMBER,
  DEBTOR_INFO,
  DEBT_DETAILS,
  PAYMENT_CODES
} from './constants';

type PaymentMethod = 'pix' | 'boleto';

const WhatsAppIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {/* Background rounded square */}
    <rect width="24" height="24" rx="4.8" ry="4.8" fill="#25D366" />
    {/* Foreground speech bubble with phone */}
    <path 
      fill="#FFFFFF" 
      d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.42 1.32 4.94L2 22l5.25-1.38c1.48.83 3.16 1.26 4.79 1.26h.01c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z m4.6 12.38c-.3-.15-1.76-.87-2.04-1-.27-.12-.47-.12-.67.12-.2.24-.77 1-.94 1.2-.18.18-.35.2-.64.07-1.76-.7-2.97-1.36-4.1-2.9-.84-1.14-1.28-2.3-1.42-2.7-.14-.4-.02-.62.18-.81.18-.17.4-.44.6-.6.2-.17.27-.28.4-.48.14-.2.07-.38-.03-.53-.1-.15-.47-1.13-.64-1.53-.18-.4-.36-.34-.5-.34h-.44c-.14 0-.38.06-.58.3-.2.23-.78.76-.78 1.85s.8 2.15.9 2.3c.12.15 1.57 2.4 3.78 3.32 2.24.92 2.65.85 3.3.73.66-.12 1.76-1.03 2-1.23.24-.2.24-.37.17-.52-.07-.15-.3-.22-.6-.37z"
    />
  </svg>
);


const App: React.FC = () => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(IP_DEFAULT_VIEW as PaymentMethod);
  const [accessDate, setAccessDate] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    setAccessDate(new Date().toLocaleString('pt-BR'));
  }, []);

  const handleCopy = useCallback((text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }, []);

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${WHATSAPP_MESSAGE}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <main className="font-sans antialiased text-[#111] min-h-screen py-7 px-4">
      <div className="bg-white max-w-4xl mx-auto rounded-lg shadow-lg p-4 sm:p-6">
        <header className="text-center mb-3">
          <h1 className="text-xl font-[800] leading-tight">INTIMAÇÃO DE PROTESTO</h1>
          <a href="https://atos.cnj.jus.br/atos/detalhar/5243" target="_blank" rel="noopener" className="text-sm text-[#1f4bcc] underline hover:no-underline mt-1 inline-block">
            (art. 356, 5º, do CNN/CN/CNJ-Extra)
          </a>
        </header>

        <section className="bg-[#f6f8ff] border-l-4 border-[#1f4bcc] rounded-r-md p-3 my-4 text-sm">
          <p><strong>Devedor:</strong> {DEBTOR_INFO.name}</p>
          <p><strong>CPF/CNPJ:</strong> {DEBTOR_INFO.doc}</p>
          <p><strong>Intimado em:</strong> {accessDate}</p>
        </section>

        <section>
          <div className="text-center my-3">
            <h2 className="font-bold text-base">Dados da dívida</h2>
          </div>

          <div className="space-y-1 text-sm mb-4 px-2">
            {DEBT_DETAILS.map(detail => (
              <p key={detail.label}>
                <span className="font-bold text-gray-700">{detail.label}:</span>
                {' '}
                <span className={detail.isTotal ? 'font-[800] text-red-700' : 'text-gray-800'}>{detail.value}</span>
              </p>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200 pt-4">
          <div className="text-center mb-4">
              <span className="inline-block px-3 py-1.5 rounded-full text-xs font-bold leading-none bg-orange-100 text-[#b45309] border border-orange-200">
                🟠 Transcorrendo prazo para pagamento
              </span>
          </div>
          
          <div role="radiogroup" className="flex gap-4 justify-center items-center my-2">
            {(['boleto', 'pix'] as PaymentMethod[]).map(method => (
              <label key={method} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 cursor-pointer font-bold text-sm has-[:checked]:bg-[#1f4bcc] has-[:checked]:text-white has-[:checked]:border-[#1f4bcc] transition-colors">
                <input 
                  type="radio" 
                  name="ip-payview" 
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  className="w-4 h-4 accent-[#1f4bcc]"
                />
                Mostrar {method.charAt(0).toUpperCase() + method.slice(1)}
              </label>
            ))}
          </div>

          {paymentMethod === 'boleto' && (
            <div className="mt-4 animate-fadeIn">
              <label htmlFor="ip-boleto" className="block mb-1.5">
                <span className="font-extrabold">🧾 BOLETO BANCÁRIO </span>
                <span className="font-normal">(Copie e cole no aplicativo de seu banco)</span>
              </label>
              <div className="flex gap-2 items-center">
                <input id="ip-boleto" type="text" className="flex-auto w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white font-mono text-sm" value={PAYMENT_CODES.boleto} readOnly />
                <button onClick={() => handleCopy(PAYMENT_CODES.boleto, 'boleto')} className="flex-none px-3 py-2.5 rounded-lg border-0 bg-[#4caf50] text-white cursor-pointer font-extrabold whitespace-nowrap w-28 transition-colors hover:bg-green-600">
                  {copiedKey === 'boleto' ? '✅ Copiado' : '📋 Copiar'}
                </button>
              </div>
            </div>
          )}

          {paymentMethod === 'pix' && (
            <div className="mt-4 animate-fadeIn">
              <label htmlFor="ip-pix" className="block mb-1.5">
                <span className="font-extrabold">🔑 PIX </span>
                <span className="font-normal">(Copie e cole no aplicativo de seu banco)</span>
              </label>
              <div className="flex gap-2 items-center">
                <input id="ip-pix" type="text" className="flex-auto w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-white font-mono text-sm" value={PAYMENT_CODES.pix} readOnly />
                <button onClick={() => handleCopy(PAYMENT_CODES.pix, 'pix')} className="flex-none px-3 py-2.5 rounded-lg border-0 bg-[#4caf50] text-white cursor-pointer font-extrabold whitespace-nowrap w-28 transition-colors hover:bg-green-600">
                  {copiedKey === 'pix' ? '✅ Copiado' : '📋 Copiar'}
                </button>
              </div>
            </div>
          )}
        </section>

        <button onClick={handleWhatsAppShare} className="block w-full sm:w-auto mx-auto mt-6 px-6 py-3.5 rounded-xl border-0 bg-[#25d366] text-white font-black cursor-pointer text-base sm:text-lg text-center transition-transform hover:scale-105">
          📱 Imprimir/Gerar PDF do Boleto e enviar por WhatsApp
        </button>

        <footer className="mt-6 p-4 sm:p-6 rounded-lg border border-yellow-300 bg-yellow-50 text-gray-900 text-justify text-base leading-relaxed">
          <p className="font-black">⚠️ <strong>Atenção:</strong> Esta comunicação tem caráter <strong>oficial</strong> e representa sua <strong>oportunidade de quitação antes da efetivação do protesto</strong>.</p>
          <p className="text-gray-700 mt-3">Se o pagamento não for realizado, o protesto será efetivado, resultando na inclusão do seu CPF nos cadastros de proteção ao crédito (SPC, Serasa e demais bureaus financeiros).</p>
          <p className="text-gray-700 mt-3">Após o protesto, o valor da dívida é acrescido de juros, correção monetária e custas cartorárias, e a restrição passa a constar publicamente, podendo impactar financiamentos, compras e contratos futuros.</p>
          
          <p className="font-black mt-4">✅ Como resolver agora: <span className="font-normal">Regularize sua pendência de forma rápida, simples e segura.</span></p>
          <p className="mt-1">Gere o boleto ou realize o pagamento via PIX.</p>

          <p className="font-black mt-4">💬 Atendimento humano: <span className="font-normal">Caso prefira auxílio direto, contate o WhatsApp oficial:</span></p>
          <p className="text-center my-2">
            <a href={`https://wa.me/${WHATSAPP_SUPPORT_NUMBER}`} target="_blank" rel="noopener" className="text-blue-700 underline font-semibold inline-flex items-center justify-center gap-2">
              <WhatsAppIcon className="w-4 h-4" />
              (63) 9 9933-9195
            </a>
          </p>

          <p className="mt-8">Atenciosamente,</p>

          <div className="mt-6 text-gray-700 text-sm space-y-1 text-left">
            <p><strong className="font-black text-gray-800">Arya</strong> – Assistente Virtual</p>
            <p>Cartório de Protesto de Araguaína – TO</p>
            <p>🌐 <a href="https://www.cartorioaraguaina.com" target="_blank" rel="noopener" className="text-blue-700 underline">www.cartorioaraguaina.com</a></p>
            <p>📍 Rua Tapajós, Quadra H, Lote 02, Jardim Filadélfia, Araguaína–TO</p>
            <p>☎️ (63) 9 9933-9195</p>
          </div>
          
          <hr className="my-4 border-yellow-300" />

          <p className="text-xs text-gray-600 mt-4 leading-snug">
            <strong>Aviso Legal (LGPD):</strong> Esta mensagem destina-se exclusivamente ao(à) titular dos dados acima. Caso você não seja o destinatário, descarte-a e comunique-nos. O uso indevido das informações é vedado pela Lei nº 13.709/2018 (LGPD). Para não receber novos e-mails, solicite o descadastramento pelos nossos canais oficiais.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default App;