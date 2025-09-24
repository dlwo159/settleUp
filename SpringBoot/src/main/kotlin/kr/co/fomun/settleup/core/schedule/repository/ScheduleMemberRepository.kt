package kr.co.fomun.settleup.core.schedule.repository

import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import org.springframework.data.jpa.repository.JpaRepository

interface ScheduleMemberRepository : JpaRepository<ScheduleMember, Long>, ScheduleMemberRepositoryCustom {
    fun findByScheduleIdAndMemberId(scheduleId: String, memberId: Long): ScheduleMember?

    fun findAllByScheduleIdOrderByMemberIdAsc(scheduleId: String): List<ScheduleMember>

    fun deleteByScheduleIdAndMemberId(scheduleId: String, memberId: Long): Long

    fun deleteByScheduleId(scheduleId: String): Long
}

interface ScheduleMemberRepositoryCustom {
    fun maxByMemberId(scheduleId: String): Long

    fun updateByScheduleIdAndMemberId(scheduleMember: ScheduleMember): Long
}