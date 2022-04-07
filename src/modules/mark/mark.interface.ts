import { Status } from './mark.enum'

export interface IMarksDetail {
  studentId: number
  totalPoint: number
}

export interface IMark {
  classId: number
  semester: number
  startYear: number
  endYear: number
}

export interface ITimeResponse {
  id: number
  startYear: number
  endYear: number
  semester: number
  startTimeStudent: Date
  endTimeStudent: Date
  startTimeMonitor: Date
  endTimeMonitor: Date
  startTimeHeadMaster: Date
  endTimeHeadMaster: Date
  startTimeDepartment: Date
  endTimeDepartment: Date
  createdAt: Date
  updatedAt: Date
  status: Status
}
