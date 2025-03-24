import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'
import bcrypt from 'bcryptjs'

export const singninRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()


//testing
singninRouter.get('/hi', (c)=>{
  return c.text("hello")
})

singninRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const body = await c.req.json()
  try {
    const hashedPassword = await bcrypt.hash(body.password, 10)

    const newUser = await prisma.user.create({
      data: {
        email: body.email,
        password: hashedPassword,
        name: body.name
      }
    })

    const token = await sign({ id: newUser.id }, c.env.JWT_SECRET)
    console.log(token)
    return c.json({ token })

  } catch (err) {
    //testing ahain
    console.log("Errorr logging in is: " , err)
    c.status(411)
    return c.json("Please verify that your username and password are entered correctly.")
  }
})

singninRouter.post('/login', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL
  }).$extends(withAccelerate())

  const loginBody = await c.req.json()

  try {
    const userExists = await prisma.user.findUnique({
      where: {
        email: loginBody.email,
      }
    })

    if (!userExists) {
      c.status(411)
      return c.json("The username does not exist or the password entered is incorrect. Please check your credentials and try again")
    }

    const passwordMatch = await bcrypt.compare(loginBody.password, userExists.password)

    if (!passwordMatch) {
      c.status(411)
      return c.json("The username does not exist or the password entered is incorrect. Please check your credentials and try again")
    }

    const token = await sign({ id: userExists.id }, c.env.JWT_SECRET)
    c.status(200)
    console.log(token)
    return c.json({ token })
  } catch (err) {
    c.status(403)
    return c.json("An error occurred while logging in. Please try again.")
  }
})

export default singninRouter
