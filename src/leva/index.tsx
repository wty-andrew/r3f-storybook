import { LevaPanel, useCreateStore as useCreateStoreImpl } from 'leva'
import { useLayoutEffect } from 'react'
import { create } from 'zustand'

type LevaStore = ReturnType<typeof useCreateStore>

type State = {
  store: LevaStore | null
}

const useLevaStore = create<State>()(() => ({
  store: null,
}))

export const setLevaStore = (store: LevaStore | null) =>
  useLevaStore.setState({ store })

export const useCreateStore = () => {
  const store = useCreateStoreImpl()
  useLayoutEffect(() => setLevaStore(store), [store])

  return store
}

const Leva = () => {
  const store = useLevaStore((state) => state.store)
  return <LevaPanel store={store} />
}

export default Leva
