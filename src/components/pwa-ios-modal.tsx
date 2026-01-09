'use client';

import { X } from 'lucide-react';

export default function InstallIosPwaModal({ onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-sm space-y-4 relative">
        <button className="absolute right-3 top-3" onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold">Instalar na Tela Inicial</h2>

        <p className="text-sm text-gray-700">
          Para ativar notificações no iPhone, você precisa instalar o app:
        </p>

        <ol className="list-decimal ml-4 text-sm text-gray-700 space-y-1">
          <li>
            Toque no botão <strong>Compartilhar</strong> no Safari
          </li>
          <li>
            Selecione <strong>Adicionar à Tela de Início</strong>
          </li>
          <li>Abra o app instalado e ative as notificações</li>
        </ol>

        <button
          className="w-full py-2 bg-black text-white rounded-lg"
          onClick={onClose}
        >
          Entendi
        </button>
      </div>
    </div>
  );
}
