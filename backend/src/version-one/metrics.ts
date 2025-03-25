import { PrismaClient } from '@prisma/client/extension'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { verify } from 'hono/jwt'

export const metricsRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string
    JWT_SECRET: string
  }
}>()

metricsRouter.use('/*', async (c, next)=>{
  const header = c.req.header ('Authorization')|| ""
  const response = await verify(header, c.env.JWT_SECRET)
  if(response.id){
    next()
  }
  else{
    c.status(403)
    return c.json("Unauthorised")
  }
})

metricsRouter.post('/data', async (c) => {
  const prisma =  new PrismaClient({
    

    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body = await c.req.json()

  const user = await prisma.user.findUnique({
    where:{
      email: body.email
    }
  })

  if(!user || user.password != body.password){
    c.status(403)
    c.json("Unauthorized")
  }


  
  const stats = await prisma.metrics.create({
    data:{
      revenue: body.revenue,
      users: body.users,
      founderId: user.id

    }
  })

  return c.json("Stats posted succesfully, ", stats)
  
})

metricsRouter.get('/data', async (c)=>{
  const prisma =  new PrismaClient({
    

    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())
  const body = await c.req.json()
  const userExists =  await prisma.user.findUnique({
    where:{
      email: body.email
    }
  })

  if(!userExists || body.password !=  userExists.password){
    c.status(403)
    return c.json("Unauthorized")
  }

  const stats = await prisma.blog.findMany()
  c.json(stats)
})

export default metricsRouter
