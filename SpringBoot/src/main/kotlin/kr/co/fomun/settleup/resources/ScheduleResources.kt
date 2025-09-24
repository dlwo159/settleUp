package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.enum.ResultStatus
import kr.co.fomun.settleup.core.common.common.toDto
import kr.co.fomun.settleup.core.schedule.service.ScheduleService
import kr.co.fomun.settleup.dto.schedule.ScheduleRequest
import kr.co.fomun.settleup.dto.schedule.ScheduleResponse
import kr.co.fomun.settleup.security.CustomUser
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/schedules")
class ScheduleResources(
    private val scheduleService: ScheduleService,
) {
    private val logger = LoggerFactory.getLogger(ScheduleResources::class.java)

    @PostMapping
    fun create(
        @RequestBody req: ScheduleRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/create - {}", customUser.userId)
            val created = scheduleService.create(
                customUser.userId,
                req
            )
            JsonResultSet(ResultStatus.SUCCESS, ScheduleResponse.from(created))
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 3001")
        }
    }

    @PutMapping
    fun update(
        @RequestBody req: ScheduleRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/update {} - {}", req.scheduleId, customUser.userId)
            val updated = scheduleService.update(
                customUser.userId, req
            )

            JsonResultSet(ResultStatus.SUCCESS, ScheduleResponse.from(updated))
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 3002")
        }
    }

    @PutMapping("/delete")
    fun delete(
        @RequestParam scheduleId: String,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/delete {} - {}", scheduleId, customUser.userId)
            scheduleService.delete(customUser.userId, scheduleId)

            JsonResultSet(ResultStatus.SUCCESS)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 3003")
        }
    }

    @GetMapping
    fun getSchedule(
        @RequestParam scheduleId: String,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules {} - {}", scheduleId, customUser.userId)
            val result = scheduleService.findByScheduleId(customUser.userId, scheduleId)
            if (result != null) JsonResultSet(ResultStatus.SUCCESS, ScheduleResponse.from(result))
            else JsonResultSet(ResultStatus.FAIL)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 3004")
        }
    }

    @GetMapping("/page")
    fun pageByCustomer(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/schedules/page - {}", customUser.userId)
        val jsonResultSet = JsonResultSet()
        val sizeCheck = if (size == 0) 10 else size
        try {
            val p = scheduleService.pageBySchedules(customUser.userId, page, sizeCheck)
            jsonResultSet.setSuccess(p.toDto { ScheduleResponse.from(it) })
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 3005")
        }
        return jsonResultSet
    }
}