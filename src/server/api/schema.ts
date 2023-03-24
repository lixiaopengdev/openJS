import { string, z } from 'zod'

export const createAppSchema = z.object({
  coverImage: z.string().min(0),
  title: z.string().min(1),
  description: z.string().min(1),
  demoInput: z.string().min(1),
  prompt: z.string().min(1),
  filePath: z.string().min(0),
})

export const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  demoInput: z.string().min(1),
  prompt: z.string().min(1),
  fileData: z.any(),
  imageData: z.any(),
})
