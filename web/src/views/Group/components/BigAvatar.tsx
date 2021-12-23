import { Avatar, Theme, Typography, Box, SxProps } from '@mui/material';
import { Member } from 'api';
import React from 'react';

interface BigAvatarProps {
  member: Member;
  sx?: SxProps<Theme>;
}

const BigAvatar: React.FC<BigAvatarProps> = ({ member, sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      ...sx,
    }}>
    <Avatar alt={member.name} src={member.imageUrl} sx={{ width: { xs: 200, sm: 150, md: 200 }, height: { xs: 200, sm: 150, md: 200 } }} />
    <Typography variant='h4' fontWeight='lighter' textAlign='center'>
      {member.name}
    </Typography>
    <Typography variant='subtitle1' textAlign='center'>
      {member.title}
    </Typography>
  </Box>
);

export default BigAvatar;
