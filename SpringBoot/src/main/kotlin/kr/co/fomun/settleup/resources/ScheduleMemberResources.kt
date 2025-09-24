package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.enum.ResultStatus
import kr.co.fomun.settleup.core.paymentItem.service.PaymentItemService
import kr.co.fomun.settleup.core.paymentItem.service.PaymentMemberService
import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import kr.co.fomun.settleup.core.schedule.service.ScheduleMemberService
import kr.co.fomun.settleup.core.schedule.service.ScheduleService
import kr.co.fomun.settleup.dto.schedule.ScheduleMemberRequest
import kr.co.fomun.settleup.dto.schedule.ScheduleMemberResponse
import kr.co.fomun.settleup.security.CustomUser
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/schedules/members")
class ScheduleMemberResources(
    private val scheduleMemberService: ScheduleMemberService,
    private val scheduleService: ScheduleService,
    private val paymentMemberService: PaymentMemberService,
    private val paymentItemService: PaymentItemService,
) {
    private val logger = LoggerFactory.getLogger(ScheduleMemberResources::class.java)

    @GetMapping("/list")
    fun findAllByScheduleId(
        @RequestParam scheduleId: String,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/schedules/members/list {} - {}", scheduleId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            val list = scheduleMemberService.findAllByScheduleId(scheduleId);
            jsonResultSet.setSuccess(ScheduleMemberResponse.fromList(list))
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 4001")
        }
        return jsonResultSet
    }

    @PostMapping
    fun create(
        @RequestParam scheduleId: String,
        @RequestBody req: List<ScheduleMemberRequest>,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/members/create {} - {}", scheduleId, customUser.userId)
            scheduleService.findByScheduleId(customUser.userId, scheduleId)
            val scheduleMembers = req.map {
                ScheduleMember(
                    name = it.name,
                    payerYn = it.payerYn,
                    account = it.account,
                )
            }
            val created = scheduleMemberService.create(scheduleId, scheduleMembers)

            JsonResultSet(ResultStatus.SUCCESS, ScheduleMemberResponse.fromList(created))
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 4002")
        }
    }

    @PutMapping
    fun update(
        @RequestParam scheduleId: String,
        @RequestParam memberId: Long,
        @RequestBody req: ScheduleMemberRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/members/update {} - {} - {}", scheduleId, memberId, customUser.userId)
            val scheduleMember = ScheduleMember(
                scheduleId = scheduleId,
                memberId = memberId,
                name = req.name,
                payerYn = req.payerYn,
                account = req.account,
            )
            scheduleMemberService.update(scheduleMember)

            paymentItemService.updatePayerByScheduleIdNPayerId(
                scheduleId,
                memberId,
                req.name
            )

            paymentMemberService.updateNameByScheduleIdNMemberId(
                scheduleId,
                memberId,
                req.name
            )

            JsonResultSet(ResultStatus.SUCCESS)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 4003")
        }
    }

    @PutMapping("/delete")
    fun delete(
        @RequestParam scheduleId: String,
        @RequestParam memberId: Long,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/schedules/members/delete {} - {} - {}", scheduleId, memberId, customUser.userId)
            scheduleMemberService.delete(scheduleId, memberId)
            paymentMemberService.deleteByScheduleIdAndMemberId(scheduleId, memberId)

            JsonResultSet(ResultStatus.SUCCESS)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 4004")
        }
    }
}