export interface User {
  id: number
  username: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export interface Project {
  id: number
  name: string
  description: string
  ownerId: number
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  memberIds: number[]
}

export interface Task {
  id: number
  title: string
  description: string
  status: 'TODO' | 'IN_PROGRESS' | 'DONE'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  projectId: number
  assignedUserId: number | null
  createdAt: string
  updatedAt: string
}