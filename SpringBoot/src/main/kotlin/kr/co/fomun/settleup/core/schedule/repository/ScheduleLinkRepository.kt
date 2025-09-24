package kr.co.fomun.settleup.core.schedule.repository

import kr.co.fomun.settleup.core.schedule.domain.ScheduleLink
import org.springframework.data.jpa.repository.JpaRepository

interface ScheduleLinkRepository : JpaRepository<ScheduleLink, Long> {
    fun findByScheduleId(scheduleId: String): ScheduleLink?

    fun findByLineCode(linkCode: String): ScheduleLink?
}