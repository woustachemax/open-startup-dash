import { Hono } from 'hono'
import singninRouter from './version-one/signup'
import metricsRouter from './version-one/metrics'


const app = new Hono()

app.route('/api/signin', singninRouter )
app.route('/api/metrics', metricsRouter)

export default app
