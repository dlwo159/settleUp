package kr.co.fomun.settleup.core.schedule.repository

import kr.co.fomun.settleup.core.schedule.domain.Schedule
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface ScheduleRepository : JpaRepository<Schedule, Long>, ScheduleRepositoryCustom {
    fun findByScheduleId(scheduleId: String): Schedule?
    fun findByScheduleIdAndCustomerId(scheduleId: String, customerId: String): Schedule?
    fun findAllByCustomerIdAndDelYn(customerId: String, delYn: String = "N", pageable: Pageable): Page<Schedule>
}

interface ScheduleRepositoryCustom {
    fun makeByScheduleId(): String

    fun updateTotalCostByScheduleId(scheduleId: String, totalCost: Long): Long
}