// types/models.ts
export type ID = string

export interface Task {
  id: ID
  title: string
  description?: string
  tags?: string[]           // ใช้สำหรับย้ายด้วย Tag (Optional)
  assignee?: string         // email
  createdAt: number
}

export interface Column {
  id: ID
  name: string
  taskIds: ID[]             // เก็บลำดับ
}

export interface Board {
  id: ID
  name: string
  owner: string             // email
  members: string[]         // emails
  columns: Column[]
  tasks: Record<ID, Task>
  createdAt: number
  updatedAt: number
}
