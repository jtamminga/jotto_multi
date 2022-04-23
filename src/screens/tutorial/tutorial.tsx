import { useEffect, useState } from 'react'
import { Button, Screen } from 'src/components'
import { gameFlow, players } from 'src/core/di'
import { StepOne, StepTwo, StepThree, StepFour, StepFive } from './steps'

export function Tutorial() {

  const [step, setStep] = useState(1)

  const numSteps = 5
  const lastStep = step === numSteps

  useEffect(() => {
    players.tutorialMode()
    return () => {
      players.clearTutoralMode()
      console.log('[tutorial] unmounting')
    }
  }, [])

  return (
    <Screen title="How to play">

      <div className="text-center mb-8">
        <span className="px-3 py-2 bg-slate-100 rounded">
          Step {step} of {numSteps}
        </span>
      </div>

      <div className="grow">
        {renderStep(step)}
      </div>

      <div className="mb-3 flex space-x-3">
        <Button
          text="Previous"
          disabled={step <= 1}
          type="secondary"
          className="w-full"
          onClick={() => setStep(step - 1)}
        />

        <Button
          text={lastStep ? 'Finished' : 'Next'}
          type="primary"
          className="w-full"
          onClick={() =>
            lastStep ? gameFlow.leave() : setStep(step + 1)
          }
        />
      </div>
    </Screen>
  )
}

function renderStep(step: number) {
  let screen: JSX.Element

  switch(step) {
    case 1:
      screen = <StepOne />
      break

    case 2:
      screen = <StepTwo />
      break

    case 3:
      screen = <StepThree />
      break

    case 4:
      screen = <StepFour />
      break

    case 5:
    default:
      screen = <StepFive />
      break
  }

  return screen
}