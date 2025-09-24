package kr.co.fomun.settleup.dto.schedule

import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember

data class ScheduleMemberResponse(
    val scheduleId: String = "",
    val memberId: Long = 0L,
    val name: String = "",
    val payerYn: Boolean = false,
    val account: String? = null,
) {
    companion object {
        fun from(e: ScheduleMember) = ScheduleMemberResponse(
            e.scheduleId,
            e.memberId,
            e.name,
            e.payerYn,
            e.account,
        )

        fun fromList(members: List<ScheduleMember>): List<ScheduleMemberResponse> {
            return members.map { from(it) }
        }
    }
}