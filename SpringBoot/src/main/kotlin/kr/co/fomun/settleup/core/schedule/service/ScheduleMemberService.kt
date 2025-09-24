package kr.co.fomun.settleup.core.schedule.service

import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import kr.co.fomun.settleup.core.schedule.repository.ScheduleMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScheduleMemberService(private val scheduleMemberRepository: ScheduleMemberRepository) {

    @Transactional
    fun create(scheduleId: String, scheduleMembers: List<ScheduleMember>): List<ScheduleMember> {
        val startId = scheduleMemberRepository.maxByMemberId(scheduleId) + 1

        scheduleMembers.mapIndexed { idx, m ->
            m.scheduleId = scheduleId
            m.memberId = startId + idx
        }

        return scheduleMemberRepository.saveAll(scheduleMembers)
    }

    @Transactional
    fun update(scheduleMember: ScheduleMember) {
        scheduleMemberRepository.updateByScheduleIdAndMemberId(scheduleMember)
    }

    @Transactional
    fun delete(scheduleId: String, memberId: Long) {
        scheduleMemberRepository.deleteByScheduleIdAndMemberId(scheduleId, memberId)
    }

    @Transactional
    fun delete(scheduleId: String) {
        scheduleMemberRepository.deleteByScheduleId(scheduleId)
    }

    @Transactional(readOnly = true)
    fun findAllByScheduleId(scheduleId: String): List<ScheduleMember> {
        return scheduleMemberRepository.findAllByScheduleIdOrderByMemberIdAsc(scheduleId)
    }


    @Transactional(readOnly = true)
    fun findByScheduleIdAndMemberId(scheduleId: String, memberId: Long): ScheduleMember? {
        return scheduleMemberRepository.findByScheduleIdAndMemberId(scheduleId, memberId)
    }
}