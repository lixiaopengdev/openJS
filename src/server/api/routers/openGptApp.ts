import { createAppSchema } from '@/server/api/schema'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { revalidateHome } from '@/utils/revalidateHome'
import { sendMessageToDiscord } from '@/utils/sendMessageToDiscord'
import { z } from 'zod'

export const openGptAppRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.openGptApp.findMany({
      select: { id: true, title: true, description: true, coverImage: true, filePath: true },
      orderBy: { usedCount: 'desc' },
    })
  }),
  getById: publicProcedure.input(z.string()).query(({ input: id, ctx }) => {
    return ctx.prisma.openGptApp.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        coverImage: true,
        demoInput: true,
        hint: true,
        filePath: true,
        fileContent: true,
        owner: true,
      },
    })
  }),
  getTopNAppIds: publicProcedure
    .input(z.number())
    .query(({ input: count, ctx }) => {
      return ctx.prisma.openGptApp.findMany({
        orderBy: {
          usedCount: 'desc',
        },
        take: count,
        select: {
          id: true,
        },
      })
    }),
  incUsage: publicProcedure
    .input(z.string())
    .mutation(async ({ input: appId, ctx }) => {
      return ctx.prisma.openGptApp.update({
        where: { id: appId },
        data: {
          usedCount: {
            increment: 1,
          },
        },
      })
    }),
  create: publicProcedure
    .input(createAppSchema)
    .mutation(async ({ input, ctx }) => {
      const v = await ctx.prisma.openGptApp.create({
        data: {
          title: input.title,
          description: input.description,
          coverImage: input.coverImage,
          demoInput: input.demoInput,
          prompt: input.prompt,
          filePath: input.filePath,
          fileContent: "",
          owner: "",
        },
      })
      // await sendMessageToDiscord({
      //   id: v.id,
      //   name: v.title,
      //   description: v.description,
      // })

      // no need to wait
      // revalidateHome()
      return v
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input: id, ctx }) => {
      const deletedApp = await ctx.prisma.openGptApp.delete({
        where: { id },
      });
      return { success: true, deletedApp, id: id };
    }),
})
