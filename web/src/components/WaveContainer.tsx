import { Container, useTheme } from '@mui/material';
import React from 'react';
import useWindowSize from 'utils/useWindowSize';

interface WaveContainerProps {
  children?: React.ReactElement;
  paddingTop?: string | number;
  paddingBottom?: string | number;
}

const WaveContainer: React.FC<WaveContainerProps> = ({ children, paddingTop = 64, paddingBottom = 16 }) => {
  const theme = useTheme();
  const size = useWindowSize();

  const height = Math.max(size.width * 0.04, 16);

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          paddingTop,
          paddingBottom,
          background: theme.palette.primary.dark,
          wordWrap: 'break-word',
        }}>
        <Container>{children}</Container>
      </div>
      <svg viewBox='0 1.4 20 1.2' width='100%' height={height} preserveAspectRatio='none'>
        <path fill={theme.palette.primary.dark} d='M 0 2 C 10 4 10 0 20 2 L 20 0 L 0 0 Z' />
      </svg>
    </div>
  );
};

export default WaveContainer;
