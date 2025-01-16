import { Position } from '../../types';
import styled from 'styled-components';
import characterUrl from './character.png';
import { Ref } from 'react';

interface CharacterProps {
  size: number;
  characterRef?: Ref<HTMLDivElement>;
}

export const CharacterView = ({ size, characterRef }: CharacterProps) => {
  return <StyledCharacter ref={characterRef} $size={size} />
}

const StyledCharacter = styled.div<{ $size: number }>`
  position: absolute;
  width: ${({ $size}) => $size}px;
  height: ${({ $size}) => $size}px;
  background-image: url("${characterUrl}");
  background-size: contain;
  
`;
