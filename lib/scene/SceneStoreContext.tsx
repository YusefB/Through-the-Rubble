'use client'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import {
  createSceneStore,
  type SceneStore,
  type SceneStoreApi,
  type SceneStoreState,
} from './store'

const SceneStoreContext = createContext<SceneStoreApi | null>(null)

export function SceneStoreProvider({
  initial,
  children,
}: {
  initial: SceneStoreState
  children: ReactNode
}) {
  const storeRef = useRef<SceneStoreApi | null>(null)
  if (!storeRef.current) {
    storeRef.current = createSceneStore(initial)
  }
  return (
    <SceneStoreContext.Provider value={storeRef.current}>
      {children}
    </SceneStoreContext.Provider>
  )
}

export function useSceneStore<T>(selector: (state: SceneStore) => T): T {
  const store = useContext(SceneStoreContext)
  if (!store) {
    throw new Error('useSceneStore must be used inside <SceneStoreProvider>')
  }
  return useStore(store, selector)
}

export function useSceneStoreApi(): SceneStoreApi {
  const store = useContext(SceneStoreContext)
  if (!store) {
    throw new Error('useSceneStoreApi must be used inside <SceneStoreProvider>')
  }
  return store
}
