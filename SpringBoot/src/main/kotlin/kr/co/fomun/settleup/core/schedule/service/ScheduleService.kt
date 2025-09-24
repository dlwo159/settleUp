package kr.co.fomun.settleup.core.schedule.service

import kr.co.fomun.settleup.core.customer.external.CustomerExternalService
import kr.co.fomun.settleup.core.schedule.domain.Schedule
import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import kr.co.fomun.settleup.core.schedule.repository.ScheduleMemberRepository
import kr.co.fomun.settleup.core.schedule.repository.ScheduleRepository
import kr.co.fomun.settleup.dto.schedule.ScheduleRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScheduleService(
    private val scheduleRepository: ScheduleRepository,
    private val scheduleMemberRepository: ScheduleMemberRepository,
    private val customerExternalService: CustomerExternalService
) {

    @Transactional
    fun create(customerId: String, scheduleRequest: ScheduleRequest): Schedule {
        val customer = customerExternalService.findByCustomerId(customerId)
            ?: throw IllegalArgumentException()

        val newScheduleId = scheduleRepository.makeByScheduleId()
        val schedule = Schedule(
            scheduleId = newScheduleId,
            customerId = customerId,
            title = scheduleRequest.title,
            date = scheduleRequest.date,
            color = scheduleRequest.color,
            totalCost = scheduleRequest.totalCost,
        )
        val scheduleMember = ScheduleMember(
            scheduleId = newScheduleId,
            memberId = 1,
            name = customer.name,
            account = customer.account,
            payerYn = false,
        )
        scheduleMemberRepository.save(scheduleMember)
        return scheduleRepository.save(schedule)
    }

    @Transactional
    fun update(customerId: String, scheduleRequest: ScheduleRequest): Schedule {
        val schedule = scheduleRepository.findByScheduleIdAndCustomerId(scheduleRequest.scheduleId, customerId)
            ?: throw IllegalArgumentException()
        schedule.title = scheduleRequest.title
        schedule.date = scheduleRequest.date
        schedule.color = scheduleRequest.color
        schedule.totalCost = scheduleRequest.totalCost
        schedule.writer.update(customerId)
        return schedule
    }

    @Transactional
    fun updateTotalCost(scheduleId: String, totalCost: Long) {
        scheduleRepository.updateTotalCostByScheduleId(scheduleId, totalCost)
    }

    @Transactional
    fun delete(customerId: String, scheduleId: String) {
        val schedule = scheduleRepository.findByScheduleIdAndCustomerId(scheduleId, customerId)
            ?: throw IllegalArgumentException()
        schedule.delYn = "Y"
        schedule.writer.update(customerId)
    }

    @Transactional(readOnly = true)
    fun findByScheduleId(customerId: String, scheduleId: String): Schedule? {
        return scheduleRepository.findByScheduleIdAndCustomerId(scheduleId, customerId)
            ?: throw IllegalArgumentException()
    }

    @Transactional(readOnly = true)
    fun findByScheduleId(scheduleId: String): Schedule? {
        return scheduleRepository.findByScheduleId(scheduleId)
    }

    @Transactional(readOnly = true)
    fun pageBySchedules(
        customerId: String,
        page: Int,
        size: Int
    ): Page<Schedule> {
        val sort = Sort.by(
            Sort.Order.desc("date"),
            Sort.Order.desc("writer.regDate"),
            Sort.Order.desc("scheduleId")
        )
        val pageable = PageRequest.of(page, size, sort)
        return scheduleRepository
            .findAllByCustomerIdAndDelYn(customerId, "N", pageable)
    }
}