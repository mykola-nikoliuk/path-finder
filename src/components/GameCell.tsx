import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

interface GameCellProps {
  size: number;
  color: string;
  onClick?: () => void;
}

export const GameCell: FC<PropsWithChildren<GameCellProps>> = (props) => (<StyledGameCell {...props} />);

const StyledGameCell = styled.div<GameCellProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
`;
