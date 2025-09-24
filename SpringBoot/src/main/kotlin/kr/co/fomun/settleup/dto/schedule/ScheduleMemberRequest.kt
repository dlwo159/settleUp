package kr.co.fomun.settleup.dto.schedule

data class ScheduleMemberRequest(
    val scheduleId: String = "",
    val memberId: Long = 0L,
    val name: String = "",
    val payerYn: Boolean = false,
    val account: String? = null,
)