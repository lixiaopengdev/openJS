import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { SITE_DESC } from '@/utils/constants'
import { HandPointer } from '@/components/HandPointer'
import { PlusCircleIcon } from '@heroicons/react/24/outline'

export function Hero() {
  return (
    <Container className="pt-2 pb-12 text-center">
      {/* <h1 className="font-display mx-auto max-w-4xl text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Upload{' '}
        <span className="relative whitespace-nowrap text-blue-600">
          <span className="relative text-4xl sm:text-7xl">
            JS Script
          </span>
        </span>{' '}
        in seconds
      </h1> */}
      <div className="mt-10 flex justify-center">
        <Button
          variant="solid"
          color="blue"
          href="/app/new"
          className="relative"
        >
          {/* <HandPointer className="absolute -left-12" /> */}
          <div className="flex items-center gap-2">
            <PlusCircleIcon className="h-6 w-6"></PlusCircleIcon>
            <span className="mr-0.5 whitespace-nowrap">上传脚本</span>
          </div>
        </Button>
      </div>
    </Container>
  )
}
