package kr.co.fomun.settleup.dto.guest

import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember

data class GuestMemberResponse(
    val name: String = "",
    val memberId: Long = 0L,
) {
    companion object {
        fun from(m: ScheduleMember) = GuestMemberResponse(
            name = m.name,
            memberId = m.memberId,
        )

        fun fromList(members: List<ScheduleMember>): List<GuestMemberResponse> {
            return members.map { from(it) }
        }
    }
}