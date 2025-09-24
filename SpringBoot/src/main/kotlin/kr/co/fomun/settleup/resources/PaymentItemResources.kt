package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.toDto
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentItem
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentMember
import kr.co.fomun.settleup.core.paymentItem.service.PaymentItemService
import kr.co.fomun.settleup.core.paymentItem.service.PaymentMemberService
import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import kr.co.fomun.settleup.core.schedule.service.ScheduleMemberService
import kr.co.fomun.settleup.core.schedule.service.ScheduleService
import kr.co.fomun.settleup.dto.paymentItem.PaymentItemRequest
import kr.co.fomun.settleup.dto.paymentItem.PaymentItemResponse
import kr.co.fomun.settleup.security.CustomUser
import org.slf4j.LoggerFactory
import org.springframework.data.domain.Page
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/paymentItems")
class PaymentItemResources(
    private val paymentItemService: PaymentItemService,
    private val paymentMemberService: PaymentMemberService,
    private val scheduleService: ScheduleService,
    private val scheduleMemberService: ScheduleMemberService,
) {
    private val logger = LoggerFactory.getLogger(PaymentItemResources::class.java)

    @PostMapping
    fun create(
        @RequestParam scheduleId: String,
        @RequestBody req: PaymentItemRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/create {} - {}", scheduleId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            val paymentItem = PaymentItem(
                scheduleId = scheduleId,
                paymentId = req.paymentId,
                payer = req.payer,
                payerId = req.payerId,
                title = req.title,
                cost = req.cost,
                acceptYn = true,
            )
            val result = paymentItemService.create(scheduleId, paymentItem, req.members)
            val req = PaymentItemRequest(
                scheduleId = scheduleId,
                paymentId = result.paymentId,
                payer = result.payer,
                payerId = result.payerId,
                title = result.title,
                cost = result.cost,
                members = paymentMemberService.findAllByScheduleIdAndPaymentId(scheduleId, result.paymentId)
                    .toMutableList()
            )

            val list = paymentItemService.findAllByScheduleIdAndAndAcceptYn(scheduleId, true)
            var totalCost = 0L
            val payerIdList = mutableListOf<Long>()
            list.forEach { item ->
                totalCost += item.cost
                payerIdList.add(item.payerId)
            }
            payerIdList.distinct()
            scheduleService.updateTotalCost(scheduleId, totalCost)

            val scheduleMembers = scheduleMemberService.findAllByScheduleId(scheduleId)

            scheduleMembers.forEach { member ->
                val exists = payerIdList.any { it == member.memberId }
                val scheduleMember =
                    ScheduleMember(
                        scheduleId = scheduleId,
                        memberId = member.memberId,
                        name = member.name,
                        account = member.account,
                        payerYn = exists
                    )
                scheduleMemberService.update(scheduleMember)
            }

            jsonResultSet.setSuccess(req)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5001")
        }
        return jsonResultSet
    }


    @PutMapping
    fun update(
        @RequestParam scheduleId: String,
        @RequestParam paymentId: Long,
        @RequestBody req: PaymentItemRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/update {} - {} - {}", scheduleId, paymentId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            val paymentItem = PaymentItem(
                scheduleId = scheduleId,
                paymentId = req.paymentId,
                payer = req.payer,
                payerId = req.payerId,
                title = req.title,
                cost = req.cost,
                acceptYn = true,
            )
            val result = paymentItemService.update(customUser.userId, req, req.members)
            val req = PaymentItemRequest(
                scheduleId = scheduleId,
                paymentId = result.paymentId,
                payer = result.payer,
                payerId = result.payerId,
                title = result.title,
                cost = result.cost,
                members = paymentMemberService.findAllByScheduleIdAndPaymentId(scheduleId, result.paymentId)
                    .toMutableList()
            )

            val list = paymentItemService.findAllByScheduleIdAndAndAcceptYn(scheduleId, true)
            var totalCost = 0L
            val payerIdList = mutableListOf<Long>()
            list.forEach { item ->
                totalCost += item.cost
                payerIdList.add(item.payerId)
            }
            payerIdList.distinct()
            scheduleService.updateTotalCost(scheduleId, totalCost)

            val scheduleMembers = scheduleMemberService.findAllByScheduleId(scheduleId)

            scheduleMembers.forEach { member ->
                val exists = payerIdList.any { it == member.memberId }
                val scheduleMember =
                    ScheduleMember(
                        scheduleId = scheduleId,
                        memberId = member.memberId,
                        name = member.name,
                        account = member.account,
                        payerYn = exists
                    )
                scheduleMemberService.update(scheduleMember)
            }

            jsonResultSet.setSuccess(req)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5001")
        }
        return jsonResultSet
    }

    @DeleteMapping("/delete")
    fun delete(
        @RequestParam scheduleId: String,
        @RequestParam paymentId: Long,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/delete {} - {} - {}", scheduleId, paymentId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            paymentItemService.delete(customUser.userId, scheduleId, paymentId)

            val list = paymentItemService.findAllByScheduleIdAndAndAcceptYn(scheduleId, true)
            var totalCost = 0L
            val payerIdList = mutableListOf<Long>()
            list.forEach { item ->
                totalCost += item.cost
                payerIdList.add(item.payerId)
            }
            payerIdList.distinct()
            scheduleService.updateTotalCost(scheduleId, totalCost)

            val scheduleMembers = scheduleMemberService.findAllByScheduleId(scheduleId)

            scheduleMembers.forEach { member ->
                val exists = payerIdList.any { it == member.memberId }
                val scheduleMember =
                    ScheduleMember(
                        scheduleId = scheduleId,
                        memberId = member.memberId,
                        name = member.name,
                        account = member.account,
                        payerYn = exists
                    )
                scheduleMemberService.update(scheduleMember)
            }

            jsonResultSet.setSuccess()
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5002")
        }
        return jsonResultSet
    }

    @GetMapping("/page")
    fun page(
        @RequestParam scheduleId: String,
        @RequestParam(defaultValue = "true") acceptYn: Boolean,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "10") size: Int,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/page {} - {}", scheduleId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        val sizeCheck = if (size == 0) 10 else size
        try {
            val p = paymentItemService.findPageByScheduleIdAndAcceptYn(scheduleId, acceptYn, page, sizeCheck)
            val paymentIds = mutableListOf<Long>()
            val pageOfDtos: Page<PaymentItemResponse> = p.map { pi ->
                paymentIds.add(pi.paymentId)
                PaymentItemResponse(
                    scheduleId = pi.scheduleId,
                    paymentId = pi.paymentId,
                    payer = pi.payer,
                    payerId = pi.payerId,
                    title = pi.title,
                    cost = pi.cost,
                    acceptYn = pi.acceptYn,
                    members = mutableListOf()
                )
            }

            val members = paymentMemberService.findAllByScheduleIdAndPaymentIdIn(scheduleId, paymentIds)
            val membersByPaymentId: Map<Long, List<PaymentMember>> = members.groupBy { it.paymentId }
            pageOfDtos.content.forEach { dto ->
                dto.members.addAll(membersByPaymentId[dto.paymentId].orEmpty())
            }

            jsonResultSet.setSuccess(pageOfDtos.toDto())
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5003")
        }
        return jsonResultSet
    }

    @GetMapping("/list")
    fun list(
        @RequestParam scheduleId: String,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/list {} - {}", scheduleId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            val p = paymentItemService.findAllByScheduleIdAndAndAcceptYn(scheduleId, true)
            val paymentIds = mutableListOf<Long>()
            val liatOfDtos: List<PaymentItemResponse> = p.map { pi ->
                paymentIds.add(pi.paymentId)
                PaymentItemResponse(
                    scheduleId = pi.scheduleId,
                    paymentId = pi.paymentId,
                    payer = pi.payer,
                    payerId = pi.payerId,
                    title = pi.title,
                    cost = pi.cost,
                    acceptYn = pi.acceptYn,
                    members = mutableListOf()
                )
            }

            val members = paymentMemberService.findAllByScheduleIdAndPaymentIdIn(scheduleId, paymentIds)
            val membersByPaymentId: Map<Long, List<PaymentMember>> = members.groupBy { it.paymentId }
            liatOfDtos.forEach { dto ->
                dto.members.addAll(membersByPaymentId[dto.paymentId].orEmpty())
            }

            jsonResultSet.setSuccess(liatOfDtos)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5004")
        }
        return jsonResultSet
    }

    @GetMapping("/check/count")
    fun count(
        @RequestParam scheduleId: String,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        logger.info("/api/paymentItems/count {} - {}", scheduleId, customUser.userId)
        val jsonResultSet = JsonResultSet()
        try {
            val count = paymentItemService.countByScheduleIdAndAcceptYn(scheduleId, false)
            jsonResultSet.setSuccess(count)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 5005")
        }
        return jsonResultSet
    }
}