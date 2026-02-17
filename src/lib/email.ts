import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetEmail(to: string, resetLink: string) {
  await resend.emails.send({
    from: 'FDK <no-reply@workshelf.com.br>',
    to,
    subject: 'Recuperação de senha - FDK',
    html: `
  <div style="font-family: Arial, sans-serif;">
    <h2>Recuperação de senha</h2>
    <p>Clique no botão abaixo para redefinir sua senha:</p>

    <p>
      <a href="${resetLink}" target="_blank"
         style="
           display:inline-block;
           background:#2563eb;
           color:#ffffff;
           padding:12px 20px;
           border-radius:6px;
           text-decoration:none;
           font-weight:bold;
         ">
         Redefinir senha
      </a>
    </p>

    <p style="margin-top:20px;font-size:12px;color:#666;">
      Se o botão não funcionar, copie e cole este link no navegador:
    </p>

    <p style="word-break: break-all;">
      ${resetLink}
    </p>

    <p style="font-size:12px;color:#666;">
      Este link expira em 10 minutos.
    </p>
  </div>
`,
  });
}
