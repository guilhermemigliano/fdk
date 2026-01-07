'use client';

import { useState } from 'react';
// import StepConfirmados from './step-confirmados';
// import StepTime1 from './step-time1';
// import StepTime2 from './step-time2';
import { Button } from '@/components/ui/button';

export default function WizardClient({ match }: any) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(match);

  return (
    <div className="p-6 space-y-6">
      {/* {step === 1 && <StepConfirmados data={data} onChange={setData} />}
      {step === 2 && <StepTime1 data={data} onChange={setData} />}
      {step === 3 && <StepTime2 data={data} onChange={setData} />} */}

      <div className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={() => setStep(step - 1)}>
            Voltar
          </Button>
        )}

        {step < 3 ? (
          <Button onClick={() => setStep(step + 1)}>Avançar</Button>
        ) : (
          <Button onClick={() => console.log('SALVAR', data)}>Salvar</Button>
        )}
      </div>
    </div>
  );
}
