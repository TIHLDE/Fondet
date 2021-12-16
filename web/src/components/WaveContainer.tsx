import { Container, useTheme } from '@mui/material';
import React from 'react';
import useWindowSize from 'utils/useWindowSize';

interface WaveContainerProps {
  children?: React.ReactElement;
  paddingTop?: string | number;
  paddingBottom?: string | number;
}

const WaveContainer: React.FC<WaveContainerProps> = ({ children, paddingTop = 64, paddingBottom = 16 }: WaveContainerProps) => {
  const theme = useTheme();
  const size = useWindowSize();

  const height = (size.width ?? 0) * 0.05;

  return (
    <div>
      <div
        style={{
          paddingTop,
          paddingBottom,
          background: theme.palette.primary.main,
          wordWrap: 'break-word',
        }}>
        <Container>{children}</Container>
      </div>
      <svg viewBox='0 1.4 20 1.2' width={size.width} height={height} preserveAspectRatio='none'>
        <path fill={theme.palette.primary.main} d='M 0 2 C 10 4 10 0 20 2 L 20 0 L 0 0 Z' />
      </svg>
    </div>
  );
};

export default WaveContainer;
