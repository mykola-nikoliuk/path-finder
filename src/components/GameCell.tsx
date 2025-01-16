import { FC, PropsWithChildren } from 'react';
import styled from 'styled-components';

interface GameCellProps {
  size: number;
  color: string;
  onClick?: (e: MouseEvent) => void;
}

export const GameCell: FC<PropsWithChildren<GameCellProps>> = (props) => (<StyledGameCell {...props} />);

const StyledGameCell = styled.div<GameCellProps>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background-color: ${props => props.color};
  border: 0;
  opacity: 0.9;
  border-bottom: solid 1px grey;
  border-right: solid 1px grey;
  box-sizing: border-box;
`;
