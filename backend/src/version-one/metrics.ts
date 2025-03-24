import { Hono } from 'hono'

export const metricsRouter = new Hono<{
  Bindings:{
    DATABASE_URL: String
  }
}>()

metricsRouter.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default metricsRouter
