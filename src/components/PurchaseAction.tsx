import { PURCHASE_URL } from '@/utils/constants'

interface PurchaseActionProps {
  onAlreadyPurchasedClick: () => void
}
export const PurchaseAction = (props: PurchaseActionProps) => {
  return (
    <>
      <p className="text-base font-semibold text-gray-600">限时 6 折</p>
      <p className="mt-6 flex items-baseline justify-center gap-x-2">
        <span className="text-5xl font-bold tracking-tight text-gray-900">
          $3
        </span>
        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
          50 次
        </span>
      </p>
      <p className="mt-6 flex items-baseline justify-center gap-x-2">
        <span className="text-5xl font-bold tracking-tight text-gray-900">
          $6
        </span>
        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
          120 次
        </span>
      </p>
      <p className="mt-6 flex items-baseline justify-center gap-x-2">
        <span className="text-5xl font-bold tracking-tight text-gray-900">
          $12
        </span>
        <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
          300 次
        </span>
      </p>
      <a
        href={PURCHASE_URL}
        className="mt-10 block w-full rounded-full bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        购买
      </a>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-gray-50 px-2 text-gray-500">Or</span>
        </div>
      </div>

      <div>
        <button
          onClick={props.onAlreadyPurchasedClick}
          className="inline-flex w-full justify-center rounded-full bg-white py-2 px-4 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
        >
          <span className="">已经购买点这里</span>
        </button>
      </div>
    </>
  )
}
