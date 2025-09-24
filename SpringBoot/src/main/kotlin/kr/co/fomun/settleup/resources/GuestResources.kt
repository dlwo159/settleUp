package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.core.customer.service.DeviceService
import kr.co.fomun.settleup.core.outbound.service.FirebaseMessagingService
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentItem
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentMember
import kr.co.fomun.settleup.core.paymentItem.service.PaymentItemService
import kr.co.fomun.settleup.core.schedule.service.ScheduleLinkService
import kr.co.fomun.settleup.core.schedule.service.ScheduleMemberService
import kr.co.fomun.settleup.core.schedule.service.ScheduleService
import kr.co.fomun.settleup.dto.guest.GuestMemberResponse
import kr.co.fomun.settleup.dto.guest.GuestPaymentItemRequest
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.*
import java.time.LocalDate
import java.time.format.DateTimeFormatter


@RestController
@RequestMapping("/api/guest")
class GuestResources(
    private val scheduleService: ScheduleService,
    private val scheduleMemberService: ScheduleMemberService,
    private val scheduleLinkService: ScheduleLinkService,
    private val paymentItemService: PaymentItemService,
    private val deviceService: DeviceService,
    private val firebaseMessagingService: FirebaseMessagingService,
) {
    private val logger = LoggerFactory.getLogger(GuestResources::class.java)

    @GetMapping
    fun getGuest(@RequestParam code: String): JsonResultSet {
        logger.info("/api/guest - {}", code)
        val jsonResultSet = JsonResultSet()
        try {
            val scheduleLink = scheduleLinkService.findByLineCode(code)
            if (scheduleLink == null) {
                jsonResultSet.setFail("잘못된 접근입니다")
                return jsonResultSet
            }
            val today = LocalDate.now()
            val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")
            val givenDate = LocalDate.parse(scheduleLink.closeDate, formatter)

            when {
                givenDate.isBefore(today) -> jsonResultSet.setFail("마감된 일정입니다")
                else -> {
                    val scheduleMembers = scheduleMemberService.findAllByScheduleId(scheduleLink.scheduleId)
                    jsonResultSet.setSuccess(GuestMemberResponse.fromList(scheduleMembers))
                }

            }
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 7001")
        }
        return jsonResultSet
    }

    @PostMapping("/save")
    fun postGuest(@RequestParam code: String, @RequestBody body: GuestPaymentItemRequest): JsonResultSet {
        logger.info("/api/guest/save - {}", code)
        val jsonResultSet = JsonResultSet()
        try {
            val scheduleLink = scheduleLinkService.findByLineCode(code)
            if (scheduleLink == null) {
                jsonResultSet.setFail("잘못된 접근입니다")
                return jsonResultSet
            }
            val scheduleId = scheduleLink.scheduleId

            val payerMember = scheduleMemberService.findByScheduleIdAndMemberId(scheduleId, body.payer)
            if (payerMember == null) {
                jsonResultSet.setFail("잘못된 접근입니다")
                return jsonResultSet
            }
            val scheduleMembers = scheduleMemberService.findAllByScheduleId(scheduleId)
            body.paymentItemList.forEach {
                val paymentMembers: MutableList<PaymentMember> = mutableListOf()
                it.memberList.forEach { m ->
                    val memberName = scheduleMembers.find { sm -> m.memberId == sm.memberId }?.name
                    if (memberName == null) {
                        jsonResultSet.setFail("잘못된 접근입니다")
                        return jsonResultSet
                    }
                    val paymentMember = PaymentMember(
                        memberId = m.memberId,
                        name = memberName,
                    )
                    paymentMembers.add(paymentMember)
                }
                val paymentItem = PaymentItem(
                    scheduleId = scheduleId,
                    payer = body.payerName,
                    payerId = body.payer,
                    title = it.title,
                    cost = it.cost,
                )
                paymentItemService.create(scheduleId, paymentItem, paymentMembers, Writer("G000000000"))
            }
            if (body.account != null) {
                payerMember.account = body.account
                scheduleMemberService.update(payerMember)
            }

            val schedule = scheduleService.findByScheduleId(scheduleId)!!
            val device = deviceService.findByCustomerId(schedule.customerId)
            val pushToken = device.pushToken
            if (pushToken != null) {
                val data = mutableMapOf<String, String>()
                data.put("type", "PUSH01")
                data.put("scheduleId", schedule.scheduleId)
                try {
                    val result = firebaseMessagingService.sendNotification(
                        pushToken,
                        schedule.title + "에 결제내역이 등록되었습니다",
                        "결제내역을 확인 후 등록/삭제를 해주세요",
                        data,
                    )
                    logger.info("push result - {}", result)
                } catch (e: Exception) {
                    logger.error("push {}, {}", e.message, e)
                }
            }

            jsonResultSet.setSuccess()
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            jsonResultSet.setFail("고객센터로 문의해주세요\n오류코드 : 7002")
        }
        return jsonResultSet
    }
}