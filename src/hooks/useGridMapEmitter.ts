import React, { useMemo } from 'react';
import { GridMapEmitter } from '../models/GridMapEmitter';
import { GridCell, Size } from '../types';
import gridJSON from '../grid.json'

export const useGridMapEmitter = <Cell = GridCell>(localStorageKey: string = '') => {
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => {
    updateState({});
  }, []);

  return useMemo(() => {
    const localStorageString = window.localStorage.getItem(localStorageKey);
    let gridMapEmitter: GridMapEmitter<Cell>;
    if (localStorageString) {
      gridMapEmitter = GridMapEmitter.parse(localStorageString, GridMapEmitter<Cell>);
    } else {
      gridMapEmitter = GridMapEmitter.parse(JSON.stringify(gridJSON), GridMapEmitter<Cell>);
    }
    gridMapEmitter.emitter.on(GridMapEmitter.events.update, forceUpdate);
    return gridMapEmitter;
  }, [localStorageKey, forceUpdate]);
}
