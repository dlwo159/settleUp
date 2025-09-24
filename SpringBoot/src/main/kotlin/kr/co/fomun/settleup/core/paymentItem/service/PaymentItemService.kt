package kr.co.fomun.settleup.core.paymentItem.service

import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentItem
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentMember
import kr.co.fomun.settleup.core.paymentItem.repository.PaymentItemRepository
import kr.co.fomun.settleup.core.paymentItem.repository.PaymentMemberRepository
import kr.co.fomun.settleup.dto.paymentItem.PaymentItemRequest
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PaymentItemService(
    private val paymentItemRepository: PaymentItemRepository,
    private val paymentMemberRepository: PaymentMemberRepository,
) {

    @Transactional
    fun create(
        scheduleId: String,
        paymentItem: PaymentItem,
        paymentMembers: MutableList<PaymentMember>,
        writer: Writer? = null
    ): PaymentItem {
        val paymentId = paymentItemRepository.maxByPaymentId(scheduleId) + 1
        paymentItem.paymentId = paymentId

        paymentMemberRepository.deleteByScheduleIdAndPaymentId(scheduleId, paymentId)
        val paymentMembers = paymentMembers.map {
            PaymentMember(
                scheduleId = scheduleId,
                paymentId = paymentId,
                memberId = it.memberId,
                name = it.name,
            )
        }
        paymentMemberRepository.saveAll(paymentMembers)

        if (writer != null) paymentItem.writer = writer
        return paymentItemRepository.save(paymentItem)
    }

    @Transactional
    fun update(
        customerId: String,
        paymentItemRequest: PaymentItemRequest,
        paymentMembers: MutableList<PaymentMember>,
    ): PaymentItem {
        val paymentItem = paymentItemRepository.findByScheduleIdAndPaymentId(
            paymentItemRequest.scheduleId,
            paymentItemRequest.paymentId
        )
            ?: throw IllegalArgumentException()
        paymentItem.payer = paymentItemRequest.payer
        paymentItem.payerId = paymentItemRequest.payerId
        paymentItem.title = paymentItemRequest.title
        paymentItem.cost = paymentItemRequest.cost
        paymentItem.acceptYn = paymentItemRequest.acceptYn
        paymentItem.writer.update(customerId)

        paymentMemberRepository.deleteByScheduleIdAndPaymentId(paymentItem.scheduleId, paymentItem.paymentId)
        val paymentMembers = paymentMembers.map {
            PaymentMember(
                scheduleId = paymentItem.scheduleId,
                paymentId = paymentItem.paymentId,
                memberId = it.memberId,
                name = it.name,
            )
        }
        paymentMemberRepository.saveAll(paymentMembers)
        return paymentItem
    }

    @Transactional
    fun delete(customerId: String, scheduleId: String, paymentId: Long) {
        val paymentItem = paymentItemRepository.findByScheduleIdAndPaymentId(scheduleId, paymentId)
            ?: throw IllegalArgumentException()
        paymentItem.delYn = true
        paymentItem.writer.update(customerId)
    }

    @Transactional(readOnly = true)
    fun findPageByScheduleIdAndAcceptYn(
        scheduleId: String,
        acceptYn: Boolean,
        page: Int,
        size: Int
    ): Page<PaymentItem> {
        val pageable = PageRequest.of(page, size)
        return paymentItemRepository.findPageByScheduleIdAndAcceptYn(scheduleId, acceptYn, pageable)
    }

    @Transactional(readOnly = true)
    fun findAllByScheduleIdAndAndAcceptYn(
        scheduleId: String,
        acceptYn: Boolean,
    ): List<PaymentItem> {
        return paymentItemRepository.findAllByScheduleIdAndAndAcceptYn(scheduleId, acceptYn)
    }

    @Transactional
    fun updatePayerByScheduleIdNPayerId(scheduleId: String, payerId: Long, name: String): Long {
        return paymentItemRepository.updatePayerByScheduleIdNPayerId(scheduleId, payerId, name)
    }


    @Transactional(readOnly = true)
    fun countByScheduleIdAndAcceptYn(scheduleId: String, acceptYn: Boolean): Long {
        return paymentItemRepository.countByScheduleIdAndAcceptYn(scheduleId, acceptYn)
    }

}