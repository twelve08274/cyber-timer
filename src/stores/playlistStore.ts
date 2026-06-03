import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlaylistItem {
  id: string       // YouTube動画ID
  title: string
  url: string
  addedAt: number
}

export interface Playlist {
  id: string
  name: string
  items: PlaylistItem[]
  createdAt: number
}

interface PlaylistState {
  playlists: Playlist[]
  activePlaylistId: string | null   // 再生中のプレイリスト

  // プレイリスト操作
  createPlaylist: (name: string) => string   // 新しいIDを返す
  renamePlaylist: (id: string, name: string) => void
  deletePlaylist: (id: string) => void

  // 動画操作
  addItem: (playlistId: string, item: Omit<PlaylistItem, 'addedAt'>) => void
  removeItem: (playlistId: string, itemId: string) => void
  moveItem: (playlistId: string, fromIndex: number, toIndex: number) => void

  // 再生
  setActivePlaylist: (id: string | null) => void
  getPlaylist: (id: string) => Playlist | undefined
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      playlists: [],
      activePlaylistId: null,

      createPlaylist: (name) => {
        const id = `pl-${Date.now()}`
        set(s => ({
          playlists: [...s.playlists, { id, name, items: [], createdAt: Date.now() }],
        }))
        return id
      },

      renamePlaylist: (id, name) => {
        set(s => ({
          playlists: s.playlists.map(p => p.id === id ? { ...p, name } : p),
        }))
      },

      deletePlaylist: (id) => {
        set(s => ({
          playlists: s.playlists.filter(p => p.id !== id),
          activePlaylistId: s.activePlaylistId === id ? null : s.activePlaylistId,
        }))
      },

      addItem: (playlistId, item) => {
        set(s => ({
          playlists: s.playlists.map(p => {
            if (p.id !== playlistId) return p
            if (p.items.some(i => i.id === item.id)) return p  // 重複スキップ
            return { ...p, items: [...p.items, { ...item, addedAt: Date.now() }] }
          }),
        }))
      },

      removeItem: (playlistId, itemId) => {
        set(s => ({
          playlists: s.playlists.map(p =>
            p.id !== playlistId ? p : { ...p, items: p.items.filter(i => i.id !== itemId) }
          ),
        }))
      },

      moveItem: (playlistId, fromIndex, toIndex) => {
        set(s => ({
          playlists: s.playlists.map(p => {
            if (p.id !== playlistId) return p
            const items = [...p.items]
            const [moved] = items.splice(fromIndex, 1)
            items.splice(toIndex, 0, moved)
            return { ...p, items }
          }),
        }))
      },

      setActivePlaylist: (id) => set({ activePlaylistId: id }),

      getPlaylist: (id) => get().playlists.find(p => p.id === id),
    }),
    { name: 'cyber-timer-playlists' }
  )
)
