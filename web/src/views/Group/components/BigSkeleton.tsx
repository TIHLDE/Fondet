import { Theme, Box, SxProps, Skeleton } from '@mui/material';
import React from 'react';

interface BigSkeletonProps {
  sx?: SxProps<Theme>;
}

const BigSkeleton: React.FC<BigSkeletonProps> = ({ sx = {} }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 1,
      ...sx,
    }}>
    <Skeleton variant='circular' animation='wave' sx={{ width: { xs: 200, sm: 150, md: 200 }, height: { xs: 200, sm: 150, md: 200 } }} />
    <Skeleton variant='text' animation='wave' width={175} height={30} />
    <Skeleton variant='text' animation='wave' width={130} height={25} />
  </Box>
);

export default BigSkeleton;
