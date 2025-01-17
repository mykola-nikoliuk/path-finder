import styled from 'styled-components';
import { FC, PropsWithChildren } from 'react';

export const StatusBar: FC<PropsWithChildren> = ({ children }) => {
  return <StyledStatusBarWrapper>
    <StyledStatusBar>{children}</StyledStatusBar>
  </StyledStatusBarWrapper>
}

const StyledStatusBarWrapper = styled.div`
  width: 100%;
  left: 0;
  top: 8px;
  position: absolute;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const StyledStatusBar = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: #fff8;
  //color: white;
  pointer-events: all;
  user-select: none;
  backdrop-filter: blur(8px);
`;
