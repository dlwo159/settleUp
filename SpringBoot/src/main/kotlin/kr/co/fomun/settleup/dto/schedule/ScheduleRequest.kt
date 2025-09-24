package kr.co.fomun.settleup.dto.schedule

data class ScheduleRequest(
    val scheduleId: String = "",
    val title: String = "",
    val date: String = "",
    val color: String = "",
    val totalCost: Long = 0L,
)