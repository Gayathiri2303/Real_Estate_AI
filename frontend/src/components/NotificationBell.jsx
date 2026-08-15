import React, { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Divider,
  Chip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useNotifications } from '../context/NotificationContext';

function NotificationBell() {
  const [anchorEl, setAnchorEl] = useState(null);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = (id) => {
    markAsRead(id);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          {unreadCount > 0 ? <NotificationsActiveIcon /> : <NotificationsIcon />}
        </Badge>
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { width: 400, maxHeight: 500, borderRadius: 2 } }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Notifications
            {unreadCount > 0 && <Chip label={`${unreadCount} unread`} size="small" color="primary" sx={{ ml: 1 }} />}
          </Typography>
          {notifications.length > 0 && (
            <Button size="small" onClick={markAllAsRead}>Mark all read</Button>
          )}
        </Box>

        <List sx={{ overflow: 'auto', maxHeight: 400 }}>
          {notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body2" color="textSecondary">No notifications yet</Typography>
            </Box>
          ) : (
            notifications.map((notif, index) => (
              <React.Fragment key={notif.id}>
                <ListItem button onClick={() => handleNotificationClick(notif.id)}>
                  <ListItemIcon><Typography variant="h6">{notif.type}</Typography></ListItemIcon>
                  <ListItemText primary={notif.message} secondary={new Date(notif.timestamp).toLocaleString()} />
                  {!notif.read && <Chip label="New" size="small" color="primary" variant="outlined" />}
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Popover>
    </>
  );
}

export default NotificationBell;