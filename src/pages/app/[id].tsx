
import { Breadcrumb } from '@/components/Breadcrumb'
import Layout from '@/components/Layout'
import LoadingDots from '@/components/LoadingDots'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { appRouter } from '@/server/api/root'
import { prisma } from '@/server/db'
import { api } from '@/utils/api'
import Prism, { Grammar } from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import CodeBlock from './CodeBlock';

import type {
  GetStaticPaths,
  GetStaticProps,
  InferGetServerSidePropsType,
} from 'next'
import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'


type AppConfig = {
  id: string
  title: string
  description: string
  coverImage: string
  demoInput: string
  hint: string
  fileContent: string
  filePath: string
}
type PageProps = { appConfig: AppConfig }

export const getStaticPaths: GetStaticPaths = async () => {
  const caller = appRouter.createCaller({ prisma, session: null })
  const idObjArr = await caller.app.getTopNAppIds(30)
  return {
    paths: idObjArr.map((v) => ({ params: { id: v.id } })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  PageProps,
  { id: string }
> = async ({ params }) => {
  const id = params?.id

  if (!id) {
    return { notFound: true } as any
  }

  const caller = appRouter.createCaller({ prisma, session: null })
  const appConfig = await caller.app.getById(id)

  if (!appConfig) {
    return { notFound: true } as any
  }

  if (appConfig.filePath.endsWith('.js')) {
    const response = await fetch(appConfig.filePath);
    const fileContent = await response.text();
    appConfig.fileContent = fileContent;
  } else if (appConfig.filePath.endsWith('.zip')) {
    appConfig.fileContent = "zip文件"
  }

  return {
    props: {
      appConfig,
    },
  }
}

const OpenGptApp = (
  props: InferGetServerSidePropsType<typeof getStaticProps>
) => {
  const { id, demoInput, description, title, coverImage, fileContent, filePath } = props.appConfig
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState(fileContent)
  const { generate, generatedResults } = useGenerateResult()
  const incUsage = api.app.incUsage.useMutation()

  const resultRef = useRef<null | HTMLDivElement>(null)

  const scrollToResults = () => {
    if (resultRef.current !== null) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleRun = async (e: any) => {
    if (loading) {
      return
    }
    setLoading(true)

    e.preventDefault()
    await generate({ userInput, id })
    incUsage.mutate(id)

    scrollToResults()
    setLoading(false)
  }

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout>
      <Breadcrumb pages={[]} />

      <div className="mx-auto flex max-w-3xl flex-col items-center justify-center py-2">

        <main className="mt-12 flex w-full flex-1 flex-col items-center justify-center px-4 text-center sm:mt-20">
          <h1 className="max-w-[708px] text-2xl font-bold text-slate-900">
            {title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-gray-600">{description}</p>

          <div className="w-full max-w-xl">
            {/* <div className="mt-10 flex items-center space-x-3">
            <p className="text-left font-medium">{hint}</p>
          </div> */}
            <CodeBlock codeContent={fileContent} />

            <button
              className="mt-8 rounded-xl bg-black px-8 py-2 font-medium text-white hover:bg-black/80 sm:mt-10"
              onClick={() => {
                toast('敬请期待')
              }}
            >
              调试
            </button>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default OpenGptApp
