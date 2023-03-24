import AppList from '@/components/AppList'
import { Button } from '@/components/Button'
import { CallToAction } from '@/components/CallToAction'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { SearchInput } from '@/components/SearchInput'
import { appRouter } from '@/server/api/root'
import { prisma } from '@/server/db'
import type { GetStaticProps, InferGetServerSidePropsType } from 'next'
import * as R from 'ramda'
import { useState } from 'react'

import { Container } from '@/components/Container'
import { SITE_DESC } from '@/utils/constants'
import { HandPointer } from '@/components/HandPointer'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import { deleteFile } from '@/server/manager'

type App = {
  id: string
  title: string
  description: string
  coverImage: string
  filePath: string
}
type PageProps = { apps: App[] }

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const caller = appRouter.createCaller({ prisma, session: null })
  const apps = await caller.app.getAll()

  return {
    props: {
      apps,
    },
    revalidate: 120, // In seconds
  }
}

const Home = (props: InferGetServerSidePropsType<typeof getStaticProps>) => {
  const { apps } = props
  const [searchValue, setSearchValue] = useState('')
  const [sizeToShow, setSizeToShow] = useState(100)
  const [showCount, setShowCount] = useState(apps.length)
  const handleListChange = (num: any) => {
    setShowCount(num);
  }
  const list = searchValue
    ? apps.filter(
      (app) =>
        app.title.includes(searchValue) ||
        app.description.includes(searchValue)
    )
    : apps

  const handleShowMore = () => {
    setSizeToShow(sizeToShow + 100)
  }

  return (
    <>
      <Header />
      <main>
        {/* <Hero /> */}
        <div className="w-full bg-slate-50 pb-2 pt-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 grid grid-cols-1 items-center justify-between pt-10 sm:grid-cols-3 sm:pt-0 ">
              <div />
              <SearchInput
                setSearchValue={setSearchValue}
                placeholder={`Search ${showCount} apps...`}
              />
              <div className="text-center">
                <Button
                  variant="solid"
                  color="blue"
                  href="/app/new"
                  className="relative"
                >
                  <div className="flex items-center gap-2">
                    <PlusCircleIcon className="h-6 w-6"></PlusCircleIcon>
                    <span className="mr-0.5 whitespace-nowrap">上传脚本</span>
                  </div>
                </Button>
              </div >
              <div />

            </div>
            <AppList list={R.take(sizeToShow, list)} onListChange={handleListChange} />

            <div className="mt-10 flex justify-center">
              <Button color="blue" onClick={handleShowMore}>
                加载更多
              </Button>
            </div>
          </div>
        </div>
        {/* <PrimaryFeatures /> */}
        {/* <SecondaryFeatures /> */}
        {/* <CallToAction /> */}
        {/* <Testimonials /> */}
        {/* <Pricing /> */}
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  )
}

export default Home
