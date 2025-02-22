import { useTranslation } from 'react-i18next'
import { TranslatedName } from '@backend/types'
import {
  ListItemIcon,
  ListItemText,
  ListSubheader,
  MenuItem,
  Tooltip,
} from '@mui/material'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import { enqueueSnackbar } from 'notistack'

import usePrograms from '../../hooks/usePrograms'
import useLoggedInUser from '../../hooks/useLoggedInUser'
import useUserProgramsMutation from '../../hooks/useUserProgramsMutation'
import { getSortedPrograms } from '../ThesisPage/util'

const FavoritePrograms = () => {
  const { t, i18n } = useTranslation()

  const { user, isLoading: userLoading } = useLoggedInUser()
  const { programs, isLoading: programsLoading } = usePrograms({
    includeNotManaged: true,
  })

  const mutation = useUserProgramsMutation()

  const { language } = i18n

  if (!user || !programs || userLoading || programsLoading) return null

  const favoritePrograms = programs.filter((program) => program.isFavorite)
  const otherPrograms = programs.filter((program) => !program.isFavorite)

  const sortedFavoritePrograms = getSortedPrograms(favoritePrograms, language)
  const sortedOtherPrograms = getSortedPrograms(otherPrograms, language)

  const handleUpdateFavoritePrograms = (programId: string) => {
    const newFavoriteProgramIds = user.favoriteProgramIds.includes(programId)
      ? user.favoriteProgramIds.filter((id) => id !== programId)
      : [...user.favoriteProgramIds, programId]

    try {
      mutation.mutateAsync({ favoriteProgramIds: newFavoriteProgramIds })
      enqueueSnackbar(t('navbar:favoriteProgramsUpdated'), {
        variant: 'success',
      })
    } catch (error) {
      enqueueSnackbar(t('navbar:favoriteProgramsUpdateFailed'), {
        variant: 'error',
      })
    }
  }

  return (
    <>
      <ListSubheader disableSticky>
        {t('navbar:favProgramsSubHeader')}
      </ListSubheader>
      {sortedFavoritePrograms.map((program) => (
        <Tooltip
          key={program.id}
          describeChild
          title={t('navbar:removeFromFavorites')}
        >
          <MenuItem
            data-cy={`program-option-${program.id}`}
            onClick={() => handleUpdateFavoritePrograms(program.id)}
            value={program.id}
            sx={{ justifyContent: 'space-between', px: 4 }}
          >
            <ListItemIcon>
              <BookmarkIcon fontSize="small" color="primary" />
            </ListItemIcon>
            <ListItemText
              primary={program.id}
              secondary={program.name[language as keyof TranslatedName]}
            />
          </MenuItem>
        </Tooltip>
      ))}

      {sortedOtherPrograms.map((program) => (
        <Tooltip
          key={program.id}
          describeChild
          title={t('navbar:addToFavorites')}
        >
          <MenuItem
            data-cy={`program-option-${program.id}`}
            onClick={() => handleUpdateFavoritePrograms(program.id)}
            value={program.id}
            sx={{ justifyContent: 'space-between', px: 4 }}
          >
            <ListItemText
              inset
              primary={program.id}
              secondary={program.name[language as keyof TranslatedName]}
            />
          </MenuItem>
        </Tooltip>
      ))}
    </>
  )
}

export default FavoritePrograms
