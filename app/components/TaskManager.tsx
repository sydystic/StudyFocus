"use client"

import { useState, useEffect, useRef } from "react"

export type Task = {
  id: string
  title: string
  completed: boolean
  createdAt: number
}

function loadTasks(): Task[] {
  if (typeof window === "undefined") return []
  try { return JSON.parse(localStorage.getItem("sf_tasks") || "[]") } catch { return [] }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem("sf_tasks", JSON.stringify(tasks))
}

export function TaskManager({
  onSelect,
  pendingTasks,
  onPendingConsumed,
}: {
  onSelect: (task: string | null) => void
  pendingTasks?: string[]
  onPendingConsumed?: () => void
}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [input, setInput] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")
  const editRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTasks(loadTasks()) }, [])
  useEffect(() => { saveTasks(tasks) }, [tasks])
  useEffect(() => { if (editingId && editRef.current) editRef.current.focus() }, [editingId])

  // Consume pending tasks from AI breakdown
  useEffect(() => {
    if (!pendingTasks || pendingTasks.length === 0) return
    const newTasks: Task[] = pendingTasks.map(title => ({
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    }))
    setTasks(prev => [...prev, ...newTasks])
    onPendingConsumed?.()
  }, [pendingTasks]) // eslint-disable-line react-hooks/exhaustive-deps

  const update = (next: Task[]) => setTasks(next)

  const addTask = () => {
    const title = input.trim()
    if (!title) return
    const task: Task = { id: crypto.randomUUID(), title, completed: false, createdAt: Date.now() }
    update([...tasks, task])
    setInput("")
  }

  const toggleComplete = (id: string) => {
    update(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
    if (selectedId === id) { setSelectedId(null); onSelect(null) }
  }

  const deleteTask = (id: string) => {
    update(tasks.filter(t => t.id !== id))
    if (selectedId === id) { setSelectedId(null); onSelect(null) }
  }

  const selectTask = (task: Task) => {
    if (task.completed) return
    const next = selectedId === task.id ? null : task.id
    setSelectedId(next)
    onSelect(next ? task.title : null)
  }

  const startEdit = (task: Task) => { setEditingId(task.id); setEditValue(task.title) }
  const saveEdit = (id: string) => {
    const title = editValue.trim()
    if (title) update(tasks.map(t => t.id === id ? { ...t, title } : t))
    setEditingId(null)
  }

  const active = tasks.filter(t => !t.completed)
  const done = tasks.filter(t => t.completed)

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[10px] font-medium tracking-[0.25em] uppercase text-white/35">Tasks</p>

      <div className="flex gap-2">
        <input
          className="flex-1 h-10 px-3 text-sm rounded-lg bg-[#1a1a1a] border border-white/10
                     text-white placeholder-white/25 outline-none focus:border-[#7c6ff7]/60 transition-colors"
          placeholder="Add a new task…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addTask()}
        />
        <button
          onClick={addTask}
          className="h-10 px-4 text-sm font-medium rounded-lg bg-[#7c6ff7] text-white
                     hover:bg-[#6a5ef0] active:scale-95 transition-all"
        >Add</button>
      </div>

      <div className="flex flex-col gap-1">
        {tasks.length === 0 && (
          <p className="text-center text-sm text-white/20 border border-dashed border-white/10 rounded-xl py-5">
            No tasks yet. Add one above.
          </p>
        )}

        {[...active, ...done].map(task => (
          <div
            key={task.id}
            className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all
              ${selectedId === task.id
                ? "border-[#7c6ff7]/30 bg-[#1e1b3a]"
                : "border-transparent hover:bg-white/4"}
              ${task.completed ? "opacity-50" : ""}`}
          >
            <button
              onClick={() => toggleComplete(task.id)}
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                ${task.completed
                  ? "border-[#7c6ff7] bg-[#7c6ff7]"
                  : selectedId === task.id ? "border-[#7c6ff7]" : "border-white/20 hover:border-white/40"}`}
            >
              {task.completed && (
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {editingId === task.id ? (
              <input
                ref={editRef}
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") saveEdit(task.id); if (e.key === "Escape") setEditingId(null) }}
                onBlur={() => saveEdit(task.id)}
                className="flex-1 bg-transparent text-sm text-white outline-none border-b border-[#7c6ff7]/60"
              />
            ) : (
              <span
                onClick={() => !task.completed && selectTask(task)}
                onDoubleClick={() => startEdit(task)}
                className={`flex-1 text-sm cursor-pointer select-none transition-colors
                  ${task.completed ? "line-through text-white/30" : selectedId === task.id ? "text-white/90 font-medium" : "text-white/60"}`}
              >{task.title}</span>
            )}

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {!task.completed && (
                <button onClick={() => startEdit(task)} className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-xs" aria-label="Edit">✎</button>
              )}
              <button onClick={() => deleteTask(task.id)} className="w-6 h-6 flex items-center justify-center text-white/30 hover:text-red-400/70 transition-colors text-xs" aria-label="Delete">✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}