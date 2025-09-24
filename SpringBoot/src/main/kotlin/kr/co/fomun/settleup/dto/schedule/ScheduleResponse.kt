package kr.co.fomun.settleup.dto.schedule

import kr.co.fomun.settleup.core.schedule.domain.Schedule

data class ScheduleResponse(
    val scheduleId: String = "",
    val title: String = "",
    val date: String = "",
    val color: String = "",
    val totalCost: Long = 0L,
) {
    companion object {
        fun from(e: Schedule) = ScheduleResponse(
            scheduleId = e.scheduleId,
            title = e.title,
            date = e.date,
            color = e.color,
            totalCost = e.totalCost,
        )
    }
}