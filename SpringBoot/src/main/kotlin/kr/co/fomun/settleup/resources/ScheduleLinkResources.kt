package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.schedule.domain.ScheduleLink
import kr.co.fomun.settleup.core.schedule.service.ScheduleLinkService
import kr.co.fomun.settleup.dto.schedule.ScheduleLinkRequest
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/schedules/link")
class ScheduleLinkResources(private val scheduleLinkService: ScheduleLinkService) {
    private val logger = LoggerFactory.getLogger(ScheduleLinkResources::class.java)

    @PostMapping()
    fun getScheduleLink(@RequestBody req: ScheduleLinkRequest): JsonResultSet {
        logger.info("/api/schedules/link - {}", req.scheduleId)
        val jsonResultSet = JsonResultSet()
        try {
            val scheduleLink = ScheduleLink(
                scheduleId = req.scheduleId,
                closeDate = req.closeDate,
            )
            val code = scheduleLinkService.upsertAndGetCode(scheduleLink)
            jsonResultSet.setSuccess(code)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 6001")
        }
        return jsonResultSet
    }
}