import Sentry from '@sentry/node'
import logger from '../util/logger'
import { fetchUsers } from './users'
import { clearOffsets } from './util'

const runUpdater = async () => {
  await fetchUsers()
}

export const run = async () => {
  logger.info('[UPDATER] Running updater')

  try {
    await clearOffsets()
    await runUpdater()
  } catch (error) {
    Sentry.captureException(error)
    Sentry.captureMessage('Updater run failed!')
    return logger.error('[UPDATER] finished with error', error)
  }

  return logger.info('[UPDATER] Finished updating')
}
