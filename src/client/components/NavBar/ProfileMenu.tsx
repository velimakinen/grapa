import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TranslatedName, User } from '@backend/types'
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListSubheader,
  Menu,
  Skeleton,
  Tooltip,
  Typography,
} from '@mui/material'

import useLoggedInUser from '../../hooks/useLoggedInUser'
import useDepartments from '../../hooks/useDepartments'

import LanguageSelect from './LanguageSelect'
import { stringToColor } from './util'
import FavoritePrograms from './FavoritePrograms'
import Logout from './Logout'

const UserInformation = () => {
  const { t, i18n } = useTranslation()
  const { user, isLoading: userLoading } = useLoggedInUser()
  const { departments, isLoading: departmentsLoading } = useDepartments()

  if (!user || userLoading || departmentsLoading)
    return <Skeleton variant="text" width={100} />

  const { language } = i18n
  const displayedFields: (keyof User)[] = [
    'username',
    'email',
    'departmentId',
    'affiliation',
  ]

  return (
    <>
      <ListSubheader disableSticky>
        {t('navbar:userInfoSubHeader')}
      </ListSubheader>
      <ListItem sx={{ px: 4, mb: 2 }} disablePadding>
        <dl style={{ margin: 0, width: '100%' }}>
          {displayedFields.map((field) => {
            let fieldValue = user[field]
            if (fieldValue === null) return null

            if (field === 'departmentId') {
              const department = departments.find(
                (dep) => dep.id === fieldValue
              )
              fieldValue = department?.name[language as keyof TranslatedName]
            }

            return (
              <Box
                key={field}
                sx={{
                  display: 'flex',
                  my: 1,
                  justifyContent: 'space-between',
                }}
              >
                <dt>{t(`userInformation:${field}`)}:</dt>
                <dd>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'right' }}
                  >
                    {fieldValue}
                  </Typography>
                </dd>
              </Box>
            )
          })}
        </dl>
      </ListItem>
    </>
  )
}

const ProfileMenu = () => {
  const { t } = useTranslation()
  const { user, isLoading } = useLoggedInUser()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  if (isLoading) return <Skeleton variant="circular" width={40} height={40} />

  return (
    <>
      <Tooltip title={t('navbar:settings')}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'profile-settings' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : false}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              cursor: 'pointer',
              bgcolor: stringToColor(user?.username || ''),
            }}
          >
            {user?.firstName[0]}
            {user?.lastName[0]}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="profile-settings"
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflowY: 'scroll',
              overflowX: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        disableAutoFocusItem
      >
        <LanguageSelect />
        <Divider />
        <FavoritePrograms />
        <Divider />
        <UserInformation />
        <Divider />
        <Logout />
      </Menu>
    </>
  )
}

export default ProfileMenu
