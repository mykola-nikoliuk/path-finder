import React, { useMemo } from 'react';
import { GridMapEmitter } from '../models/GridMapEmitter';
import { Size } from '../types';

export const useGridMapEmitter = <Cell>(size: Size, fill: Cell, localStorageKey: string = '') => {
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
      gridMapEmitter = new GridMapEmitter<Cell>(size, fill);
    }
    gridMapEmitter.emitter.on(GridMapEmitter.events.update, forceUpdate);
    return gridMapEmitter;
  }, [size, fill, localStorageKey]);
}
