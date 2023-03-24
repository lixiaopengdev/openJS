import { api } from '@/utils/api'
import { DocumentIcon, StopIcon } from '@heroicons/react/20/solid'
import { CogIcon, EyeIcon, HandThumbUpIcon, PlayIcon, SunIcon, TvIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { prisma } from '@/server/db'
import { toast } from 'react-hot-toast'
import { useState } from 'react';
import { date } from 'zod'
import { deleteFile } from '@/server/manager'
import App from 'next/app'
interface AppListProps {
  list: Array<{
    id: string
    title: string
    description: string
    coverImage: string
    filePath: string
  }>, onListChange: any
}

const AppList = (props: AppListProps) => {
  const { list } = props
  const { onListChange } = props

  const [appList, setApplist] = useState(list)

  const mutation = api.app.delete.useMutation({
    onSuccess: (data) => {
      console.log(data);
      const newList = appList.filter(app => app.id !== data.id);
      console.log("useMutation");
      setApplist(newList);
      onListChange(newList.length);
      toast('删除成功');
    },
    onError: () => {
      toast('删除失败');
    }
  });
  const handleDelete = async (app: any) => {
    const isSure = window.confirm('确定删除此脚本？');
    if (isSure) {
      deleteFile('image', app.coverImage);
      deleteFile('file', app.filePath);
      mutation.mutate(app.id);
    }
  }
  const currentApps = appList.map((v) => ({
    id: v.id,
    title: v.title,
    description: v.description,
    href: '/app/' + v.id,
    coverImage: v.coverImage,
    iconBackground: 'bg-indigo-50',
    filePath: v.filePath,
  }))

  return (
    <ul
      role="appList"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
    >
      {currentApps.map((app) => (
        <li
          key={app.id}
          className="col-span-1 flex flex-col justify-between divide-y divide-gray-200 rounded-lg bg-white text-center shadow"
        >
          <Link href={app.href}>
            <div className="flex flex-1 flex-col p-8">
              <img src={app.coverImage}></img>
              <h3 className="mt-6 text-sm font-medium text-gray-900">
                {app.title}
              </h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                <dd className="text-sm text-gray-500">{app.description}</dd>
              </dl>
            </div>
          </Link>

          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className='flex w-0 flex-1'>
                <button className='relative -mr-px inline-flex w-0 flex-1 justify-center py-4 font-bold text-red-900'
                  onClick={() => handleDelete(app)}
                >
                  删除
                </button>
              </div>
              <div className="-ml-px flex w-0 flex-1">
                <a
                  href={app.filePath}
                  download
                  className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border border-transparent py-4 font-bold text-gray-900"
                  onClick={(event) => {
                    event.preventDefault();
                    const fileUrl = app.filePath;
                    const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                    fetch(fileUrl)
                      .then(response => response.blob())
                      .then(blob => {
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                      });
                  }}
                >
                  <DocumentIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  下载
                </a>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default AppList
