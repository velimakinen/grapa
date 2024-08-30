import express from 'express'

import { RequestWithUser } from '../types'
import { ProgramManagement, Thesis, User } from '../db/models'
import { transformThesisData } from '../util/helpers'
import { getFindThesesOptions } from './thesis'

const userRouter = express.Router()

userRouter.get('/', async (req: RequestWithUser, res: any) => {
  const { user } = req

  if (!user) return res.send({})

  const managedPrograms = await ProgramManagement.findAll({
    where: { userId: user.id },
  })
  const managedProgramIds = managedPrograms.map((program) => program.programId)

  return res.send({ ...user, managedProgramIds })
})

userRouter.put('/', async (req: RequestWithUser, res: any) => {
  const { user, body } = req
  const { departmentId } = body

  await User.update({ departmentId }, { where: { id: user.id } })

  return res.status(200).send({ message: 'User updated' })
})

userRouter.get('/theses', async (req: RequestWithUser, res: any) => {
  const options = await getFindThesesOptions({
    actionUser: req.user,
    onlySupervised: true,
  })
  const theses = await Thesis.findAll({
    ...options,
    order: [['targetDate', 'ASC']],
  })

  const thesisData = transformThesisData(JSON.parse(JSON.stringify(theses)))
  res.send(thesisData)
})

userRouter.put('/favoritePrograms', async (req: RequestWithUser, res: any) => {
  const { user, body } = req
  const { favoriteProgramIds } = body

  await User.update({ favoriteProgramIds }, { where: { id: user.id } })

  return res.status(200).send({ message: 'User favorite programs updated' })
})

export default userRouter
