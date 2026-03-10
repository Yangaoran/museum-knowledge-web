/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'vis-network/peer' {
  export { Network, Options, Data, Edge, Node, IdType } from 'vis-network/declarations/network/Network'
}
