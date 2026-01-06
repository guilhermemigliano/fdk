export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold">Termos de Uso</h1>

      <p className="text-muted-foreground">
        Última atualização: {new Date().toLocaleDateString('pt-BR')}
      </p>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Aceitação dos termos</h2>
        <p>
          Ao se cadastrar no sistema FDK, você concorda integralmente com os
          termos descritos neste documento.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Uso do sistema</h2>
        <p>
          O sistema tem como objetivo o gerenciamento de partidas de futebol,
          rankings e confirmações de presença.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Responsabilidades</h2>
        <p>
          O usuário é responsável pelas informações fornecidas, bem como pela
          participação ou ausência nas partidas confirmadas.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Privacidade</h2>
        <p>
          Os dados fornecidos são utilizados exclusivamente para o funcionamento
          do sistema e não são compartilhados com terceiros.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Alterações</h2>
        <p>
          Os termos podem ser atualizados a qualquer momento, sendo
          responsabilidade do usuário revisá-los.
        </p>
      </section>
    </div>
  );
}
