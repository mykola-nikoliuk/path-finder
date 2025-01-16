import { Position } from '../../types';
import styled from 'styled-components';
import characterUrl from './character.png';

interface CharacterProps {
  size: number;
  cellSize: number;
  position: Position;
}

export const CharacterView = ({ size, cellSize, position }: CharacterProps) => {

  const deltaSize = size - cellSize;

  const relativePosition: Position = {
    x: position.x * cellSize - deltaSize / 2,
    y: position.y * cellSize - deltaSize / 2,
  }
  return <StyledCharacter $size={size} $position={relativePosition} />
}

const StyledCharacter = styled.div<{ $size: number; $position: Position }>`
  position: absolute;
  left: ${({ $position: { x } }) => x}px;
  top: ${({ $position: { y } }) => y}px;
  width: ${({ $size}) => $size}px;
  height: ${({ $size}) => $size}px;
  background-image: url("${characterUrl}");
  background-size: contain;
  
`;
