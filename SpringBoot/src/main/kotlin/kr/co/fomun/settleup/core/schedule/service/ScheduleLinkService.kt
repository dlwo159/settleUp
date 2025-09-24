package kr.co.fomun.settleup.core.schedule.service

import kr.co.fomun.settleup.core.schedule.domain.ScheduleLink
import kr.co.fomun.settleup.core.schedule.repository.ScheduleLinkRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ScheduleLinkService(private val scheduleLinkRepository: ScheduleLinkRepository) {
    private val charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


    @Transactional
    fun upsertAndGetCode(scheduleLink: ScheduleLink): String {
        val existing = scheduleLinkRepository.findByScheduleId(scheduleLink.scheduleId)

        if (existing == null) {
            val newLink = ScheduleLink(
                scheduleId = scheduleLink.scheduleId,
                lineCode = generateUniqueLinkCode(),
                closeDate = scheduleLink.closeDate
            )
            return scheduleLinkRepository.save(newLink).lineCode
        } else {
            if (existing.closeDate != scheduleLink.closeDate) {
                existing.closeDate = scheduleLink.closeDate
            }
            return existing.lineCode
        }
    }

    @Transactional(readOnly = true)
    fun findByLineCode(linkCode: String): ScheduleLink? = scheduleLinkRepository.findByLineCode(linkCode)

    fun generateUniqueLinkCode(length: Int = 10): String {
        var code: String
        do {
            code = (1..length)
                .map { charset.random() }
                .joinToString("")
        } while (scheduleLinkRepository.findByLineCode(code) != null) // 중복체크
        return code
    }
}