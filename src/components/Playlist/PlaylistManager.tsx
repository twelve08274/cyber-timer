import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePlaylistStore, type Playlist, type PlaylistItem } from '../../stores/playlistStore'
import { useYouTubeStore, extractVideoId } from '../../stores/youtubeStore'

// ---- 共通スタイル ----
const btnPink: React.CSSProperties = {
  padding: '7px 16px',
  borderRadius: 6,
  border: '1px solid #ff2d78',
  background: 'rgba(255,45,120,0.1)',
  color: '#ff2d78',
  fontSize: 12,
  fontWeight: 700,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid #1e2d50',
  background: 'transparent',
  color: '#5a6a8a',
  fontSize: 11,
  cursor: 'pointer',
}

// ---- プレイリスト一覧サイドバー ----
function PlaylistSidebar({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  const { playlists, createPlaylist, deletePlaylist, renamePlaylist } = usePlaylistStore()
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreate = () => {
    const name = newName.trim() || '新しいプレイリスト'
    const id = createPlaylist(name)
    setNewName('')
    onSelect(id)
  }

  const handleRename = (pl: Playlist) => {
    setEditingId(pl.id)
    setEditName(pl.name)
  }

  const commitRename = () => {
    if (editingId && editName.trim()) {
      renamePlaylist(editingId, editName.trim())
    }
    setEditingId(null)
  }

  return (
    <div style={{ width: 180, flexShrink: 0 }}>
      <div style={{ fontSize: 10, color: '#5a6a8a', letterSpacing: '0.1em', marginBottom: 10 }}>
        PLAYLISTS
      </div>

      {/* 新規作成 */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCreate()}
          placeholder="名前..."
          style={{
            flex: 1,
            padding: '6px 8px',
            borderRadius: 6,
            border: '1px solid #1e2d50',
            background: 'rgba(255,255,255,0.04)',
            color: '#c8d8f0',
            fontSize: 11,
            outline: 'none',
            minWidth: 0,
          }}
        />
        <button onClick={handleCreate} style={{ ...btnPink, padding: '6px 10px', fontSize: 14, lineHeight: 1 }}>
          ＋
        </button>
      </div>

      {/* リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {playlists.length === 0 && (
          <div style={{ fontSize: 11, color: '#3a4a6a', textAlign: 'center', padding: '16px 0' }}>
            プレイリストがありません
          </div>
        )}
        {playlists.map(pl => (
          <div
            key={pl.id}
            onClick={() => onSelect(pl.id)}
            style={{
              padding: '8px 10px',
              borderRadius: 6,
              border: `1px solid ${selected === pl.id ? '#ff2d7860' : '#1e2d50'}`,
              background: selected === pl.id ? 'rgba(255,45,120,0.08)' : 'rgba(255,255,255,0.02)',
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {editingId === pl.id ? (
              <input
                autoFocus
                value={editName}
                onChange={e => setEditName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={e => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingId(null) }}
                onClick={e => e.stopPropagation()}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  outline: '1px solid #ff2d78',
                  borderRadius: 3,
                  color: '#c8d8f0',
                  fontSize: 12,
                  padding: '1px 4px',
                }}
              />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4 }}>
                <span style={{
                  fontSize: 12,
                  color: selected === pl.id ? '#ff2d78' : '#c8d8f0',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  flex: 1,
                }}>
                  📋 {pl.name}
                </span>
                <span style={{ fontSize: 10, color: '#3a4a6a', flexShrink: 0 }}>{pl.items.length}</span>
              </div>
            )}

            {/* ホバーアクション */}
            {selected === pl.id && !editingId && (
              <div style={{ display: 'flex', gap: 4, marginTop: 6 }} onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => handleRename(pl)}
                  style={{ ...btnGhost, padding: '2px 8px', fontSize: 10 }}
                >
                  編集
                </button>
                <button
                  onClick={() => deletePlaylist(pl.id)}
                  style={{ ...btnGhost, padding: '2px 8px', fontSize: 10, color: '#ff6b6b', borderColor: '#ff6b6b30' }}
                >
                  削除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- 動画アイテム ----
function VideoItem({
  item,
  playlistId,
  isPlaying,
  onPlay,
}: {
  item: PlaylistItem
  playlistId: string
  isPlaying: boolean
  onPlay: () => void
}) {
  const { removeItem } = usePlaylistStore()

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 8,
        border: `1px solid ${isPlaying ? '#ff2d7860' : '#1e2d50'}`,
        background: isPlaying ? 'rgba(255,45,120,0.08)' : 'rgba(255,255,255,0.02)',
        transition: 'background 0.2s',
      }}
    >
      <button
        onClick={onPlay}
        style={{
          background: 'none',
          border: 'none',
          color: isPlaying ? '#ff2d78' : '#5a6a8a',
          fontSize: 14,
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0,
          lineHeight: 1,
        }}
      >
        {isPlaying ? '▶' : '▷'}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12,
          color: isPlaying ? '#ff2d78' : '#c8d8f0',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.title}
        </div>
        <div style={{ fontSize: 10, color: '#3a4a6a', marginTop: 2 }}>
          youtu.be/{item.id}
        </div>
      </div>

      <button
        onClick={() => removeItem(playlistId, item.id)}
        style={{ background: 'none', border: 'none', color: '#3a4a6a', fontSize: 14, cursor: 'pointer', padding: 0, flexShrink: 0 }}
      >
        ✕
      </button>
    </motion.div>
  )
}

// ---- プレイリスト詳細 ----
function PlaylistDetail({ playlistId }: { playlistId: string }) {
  const { getPlaylist, addItem } = usePlaylistStore()
  const { loadUrl, videoId } = useYouTubeStore()
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')

  const playlist = getPlaylist(playlistId)
  if (!playlist) return null

  const handleAddUrl = async () => {
    const trimmed = urlInput.trim()
    if (!trimmed) return
    const id = extractVideoId(trimmed)
    if (!id) { setError('無効なYouTube URLです'); return }
    if (playlist.items.some(i => i.id === id)) { setError('すでに追加されています'); return }

    // タイトルはとりあえずIDで仮登録（再生時に更新）
    addItem(playlistId, {
      id,
      url: `https://www.youtube.com/watch?v=${id}`,
      title: `動画 ${id}`,
    })
    setUrlInput('')
    setError('')
  }

  const handlePlay = (item: PlaylistItem) => {
    loadUrl(item.url)
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#e8f0ff', marginBottom: 16 }}>
        📋 {playlist.name}
        <span style={{ fontSize: 11, color: '#5a6a8a', fontWeight: 400, marginLeft: 8 }}>
          {playlist.items.length}曲
        </span>
      </div>

      {/* URL追加フォーム */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
        <input
          value={urlInput}
          onChange={e => { setUrlInput(e.target.value); setError('') }}
          onKeyDown={e => e.key === 'Enter' && handleAddUrl()}
          placeholder="YouTube URLを追加..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 6,
            border: `1px solid ${error ? '#ff6b6b' : '#1e2d50'}`,
            background: 'rgba(255,255,255,0.04)',
            color: '#c8d8f0',
            fontSize: 12,
            outline: 'none',
          }}
        />
        <button onClick={handleAddUrl} style={btnPink}>
          追加
        </button>
      </div>

      {error && (
        <div style={{ fontSize: 11, color: '#ff6b6b', marginBottom: 10 }}>⚠️ {error}</div>
      )}

      {/* 動画リスト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
        {playlist.items.length === 0 ? (
          <div style={{ fontSize: 12, color: '#3a4a6a', textAlign: 'center', padding: '32px 0' }}>
            URLを追加してください
          </div>
        ) : (
          <AnimatePresence>
            {playlist.items.map(item => (
              <VideoItem
                key={item.id}
                item={item}
                playlistId={playlistId}
                isPlaying={videoId === item.id}
                onPlay={() => handlePlay(item)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ---- メイン画面 ----
export function PlaylistManager({ onClose }: { onClose: () => void }) {
  const { playlists } = usePlaylistStore()
  const [selectedId, setSelectedId] = useState<string | null>(playlists[0]?.id ?? null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        minHeight: '100vh',
        padding: '24px 24px 48px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        color: '#c8d8f0',
        maxWidth: 700,
        margin: '0 auto',
      }}
    >
      {/* ヘッダー */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#e8f0ff' }}>
            🎵 プレイリスト
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#5a6a8a' }}>
            BGMをまとめて管理・保存
          </p>
        </div>
        <button
          onClick={onClose}
          style={{ ...btnGhost, fontSize: 13 }}
        >
          ← タイマーに戻る
        </button>
      </div>

      {/* 本体 */}
      <div style={{ display: 'flex', gap: 24 }}>
        <PlaylistSidebar
          selected={selectedId}
          onSelect={setSelectedId}
        />

        <div style={{
          flex: 1,
          minWidth: 0,
          borderLeft: '1px solid #1e2d50',
          paddingLeft: 24,
        }}>
          {selectedId ? (
            <PlaylistDetail playlistId={selectedId} />
          ) : (
            <div style={{ fontSize: 13, color: '#3a4a6a', textAlign: 'center', paddingTop: 48 }}>
              左からプレイリストを選択してください
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
