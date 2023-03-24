import { Breadcrumb } from '@/components/Breadcrumb'
import { Button } from '@/components/Button'
import { ImageField } from '@/components/ImageField'
import Layout from '@/components/Layout'
import { useGenerateResult } from '@/hooks/useGenerateResult'
import { createAppSchema, formSchema } from '@/server/api/schema'
import { api, type RouterInputs } from '@/utils/api'
import { isDev } from '@/utils/isDev'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import Head from 'next/head'
import { FileField } from '@/components/FileField'
import { uploadFile, uploadImage } from '@/server/manager'
import { filepath } from 'prettier.config.cjs'

type Inputs = RouterInputs['app']['create']

const NewApp = () => {
  const { generate, generatedResults } = useGenerateResult()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({ resolver: zodResolver(formSchema) })


  const mutation = api.app.create.useMutation({
    onSuccess: (data, variables, context) => {
      console.log('onSuccess');
      router.push(`/app/${data.id}`)
    },
    onError: () => {
      console.log('onError');
      console.log('on error')
    },
  })

  const { isLoading: isCreating } = mutation

  const onSubmit: SubmitHandler<any> = async (data) => {
    try {
      const [filePath, coverImage] = await Promise.all(
        [
          uploadFile(data.fileData),
          uploadImage(data.imageData)
        ]
      );
      const dd = { ...data, "filePath": filePath, 'coverImage': coverImage };
      mutation.mutate(dd);
    } catch (e) {
      console.log(e);
    } finally {
      console.log("finally");
    }
  }

  // const handleMutiFieldChange: (newValues: any) => {
  //   // setValue('coverImage', newValues.coverImage);
  //   // setValue('imageContent', newValues.imageContent);
  // }

  return (
    <Layout>
      <div>
        <Breadcrumb pages={[{ title: '上传脚本', href: '#', current: true }]} />
        <Head>
          <title>上传脚本</title>
          <link rel="icon" href="/favicon.png" />
        </Head>
        <div className="bg-slate-50 pt-10">
          <div className="mx-auto min-h-screen max-w-xl ">
            <h1 className="py-10 text-center text-2xl font-semibold text-gray-900">
              上传脚本
            </h1>
            <form className=" space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
                <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        上传脚本封面图
                      </label>
                      <Controller
                        name="imageData"
                        control={control}
                        render={({ field }) => (
                          <ImageField
                            // value={''}
                            onChange={(value) => {
                              field.onChange(value);

                            }} />
                        )}
                      />
                      <p className="mt-2 text-sm text-red-500">
                        {/* {errors.coverImage && errors.coverImage.message} */}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        拖动或点击上传脚本封面图
                      </p>
                    </div>
                  </div>
                  <div className='grid grid-cols-3 gap-6'>
                    <div className='col-span-3 sm:col-span-2'>
                      <label className='block text-sm font-medium leading-6 text-gray-900'>
                        上传脚本文件
                      </label>
                      <Controller name='fileData'
                        control={control}
                        render={({ field }) => (
                          <FileField
                            value={''}
                            onChange={(value) => field.onChange(value)}
                          />
                        )} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        脚本名称
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="基础视频卡脚本"
                          {...register('title')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-500">
                        {errors.title && errors.title.message}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        脚本描述
                      </label>
                      <div className="mt-2">
                        <textarea
                          rows={3}
                          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          placeholder="此脚本可以调起基础视频聊天组件，并控制视频聊天当中某些功能"
                          defaultValue={''}
                          {...register('description')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-500">
                        {errors.description && errors.description.message}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        脚本设置
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <textarea
                          rows={3}
                          className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                          placeholder="暴露给脚本使用者的设置参数，默认空"
                          defaultValue={''}
                          {...register('prompt')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-500">
                        {errors.prompt && errors.prompt.message}
                      </p>
                      <p className="mt-2 text-sm text-gray-500">
                        此设置会暴露给使用者，以便控制脚本中某些参数。
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-3 sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        启动入口方法
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          className="block w-full flex-1 rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          placeholder="默认applyAction()"
                          {...register('demoInput')}
                        />
                      </div>
                      <p className="mt-2 text-sm text-red-500">
                        {errors.demoInput && errors.demoInput.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 px-4 sm:px-0">
                <Button
                  variant="solid"
                  color="white"
                  onClick={() => router.push('/')}
                >
                  取消
                </Button>

                <Button
                  variant="solid"
                  color="blue"
                  type="submit"
                  loading={isCreating ? "true" : undefined}
                >
                  上传
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NewApp
