import styled, { css } from 'styled-components';
import { StatusBar } from './StatusBar';
import { GameGrid } from './GameGrid/GameGrid';
import mapBackground from './GameGrid/mapBackground.jpg';
import { CharacterView } from './CharacterView/CharacterView';
import React, { Ref, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useGridMapEmitter } from '../hooks/useGridMapEmitter';
import { GridCell, Position } from '../types';
import { PathFinder } from '../models/PathFinder';
import { Character } from '../models/Character';
import { debounce } from 'lodash';
import { GridMapEmitter } from '../models/GridMapEmitter';


const GRID_SIZE = { width: 90, height: 60 };
const LOCAL_STORAGE_GRID_KEY = 'grid';
const minCellSize = 8;

const startPosition = { x: 0, y: 26 };
const endPosition = { x: 14, y: 14 };

export const PathFinderScreen = () => {
  const [mode, setMode] = useState('navigation');
  const screenRef = useRef<HTMLDivElement>();
  const grid = useGridMapEmitter(LOCAL_STORAGE_GRID_KEY);
  const pathFinder = useMemo(() => new PathFinder(grid), [grid]);
  const character = useMemo(() => new Character(startPosition), []);
  const characterRef = useRef<HTMLDivElement>();
  const [cellSize, setCellSize] = useState(minCellSize);
  const characterSize = cellSize * 1.5;

  const onResize = useCallback(() => {
    const screen = screenRef.current;
    if (!screen) return;

    const boundingRect = screen.getBoundingClientRect();

    setCellSize(Math.max(minCellSize, boundingRect.height / GRID_SIZE.height));
  }, []);

  const saveGrid = useMemo(() => debounce((grid: GridMapEmitter<GridCell>) => {
    window.localStorage.setItem(LOCAL_STORAGE_GRID_KEY, GridMapEmitter.stringify(grid));
  }, 1000), []);

  const setCharacterPosition = useCallback((position: Position) => {
    const characterView = characterRef.current;

    if (!characterView) return;

    const deltaSize = cellSize

    characterView.style.left = `${position.x * cellSize - deltaSize / 2}px`;
    characterView.style.top = `${position.y * cellSize - deltaSize / 2}px`;
  }, [cellSize]);

  const drawPath = useCallback((pathFinder: PathFinder) => {
    grid.replaceValue([GridCell.Trail, GridCell.Start, GridCell.End], GridCell.Empty);

    const [start, ...path] = pathFinder.getPath();

    grid.set(start, GridCell.Start);
    grid.setBatch(path, GridCell.Trail);
    grid.set(path[path.length - 1], GridCell.End);
  }, [grid]);

  useEffect(() => {
    const onMapUpdate = () => saveGrid(grid);
    grid.emitter.on(GridMapEmitter.events.update, onMapUpdate);

    setCharacterPosition(character.position);
    character.on(Character.events.moved, setCharacterPosition);

    window.addEventListener('resize', onResize);
    onResize();

    return () => {
      grid.emitter.off(GridMapEmitter.events.update, onMapUpdate);
      character.off(Character.events.moved, setCharacterPosition);
      window.removeEventListener('resize', onResize);
    }
  }, [grid, cellSize, drawPath]);

  useEffect(() => {
    pathFinder.setPoints(startPosition, endPosition);
    character.goPath(pathFinder.getPath());
    drawPath(pathFinder);
  }, []);

  const onCellClick = useCallback((position: Position, shiftKey: Boolean) => {
    if (mode === 'editor') {
      grid.set(position, shiftKey ? GridCell.Empty : GridCell.Block);
    } else {
      const closestAvailablePosition = pathFinder.findClosestAvailablePosition(position);

      if (!closestAvailablePosition) return;

      pathFinder.setPoints(character.position, closestAvailablePosition);
      character.goPath(pathFinder.getPath());
      drawPath(pathFinder);
    }
  }, [mode]);

  return <StyledScreen ref={screenRef as Ref<HTMLDivElement>}>
    <StyledMapScroller $isMinimal={cellSize === minCellSize}>
      <GameGrid grid={grid} size={cellSize} onClick={onCellClick} background={mapBackground} showWalls={mode === 'editor'} />
      <CharacterView size={characterSize} characterRef={characterRef as Ref<HTMLDivElement>} />
    </StyledMapScroller>
    <StatusBar>
      {mode === 'editor' ? (
        <>
          <span>Click on the map to set a wall. Hold shift to remove it.</span>
          <button onClick={() => setMode('navigation')}>Exit the editor</button>
        </>
      ) : (
        <>
          <span>Click on any place on the map for navigation.</span>
          <button onClick={() => setMode('editor')}>Edit the map</button>
        </>
      )}
    </StatusBar>
  </StyledScreen>
}

const StyledScreen = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
`;

const StyledMapScroller = styled.div<{ $isMinimal: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow-x: auto;
  
  ${({ $isMinimal }) => !$isMinimal && css`
    overflow-y: hidden;
  `};
`;
