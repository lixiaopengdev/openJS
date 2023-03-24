import { isDev } from '@/utils/isDev'
import axios from 'axios'

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL

export function sendMessageToDiscord(v: {
  id: string
  title: string
  description: string
}) {
  if (isDev) {
    return
  }
  if (DISCORD_WEBHOOK_URL) {
    return axios.post(DISCORD_WEBHOOK_URL, {
      username: 'OpenGpt 机器人',
      embeds: [
        {
          author: {
            name: 'OpenGpt',
            url: 'https://open-gpt-app.vercel.app/',
            icon_url: 'https://avatars.githubusercontent.com/u/6268441?v=4',
          },
          title: '有新的 App 被创建啦！🎉',
          url: `https://open-gpt-app.vercel.app/app/${v.id}`,
          description: `[点我直达](https://open-gpt-app.vercel.app/app/${v.id})`,
          color: 15258703,
          fields: [
            { title: '应用名称', value: v.title, inline: false },
            { title: '描述', value: v.description, inline: false },
          ],
        },
      ],
    })
  }
}
