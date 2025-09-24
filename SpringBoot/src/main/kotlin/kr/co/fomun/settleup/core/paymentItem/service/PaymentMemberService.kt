package kr.co.fomun.settleup.core.paymentItem.service

import kr.co.fomun.settleup.core.paymentItem.repository.PaymentMemberRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PaymentMemberService(private val paymentMemberRepository: PaymentMemberRepository) {

    @Transactional
    fun deleteByScheduleIdAndMemberId(scheduleId: String, memberId: Long) =
        paymentMemberRepository.deleteByScheduleIdAndMemberId(scheduleId, memberId)

    @Transactional
    fun updateNameByScheduleIdNMemberId(scheduleId: String, memberId: Long, name: String) =
        paymentMemberRepository.updateNameByScheduleIdNMemberId(scheduleId, memberId, name)

    @Transactional(readOnly = true)
    fun findAllByScheduleIdAndPaymentId(scheduleId: String, paymentId: Long) =
        paymentMemberRepository.findAllByScheduleIdAndPaymentId(scheduleId, paymentId)

    @Transactional(readOnly = true)
    fun findAllByScheduleIdAndPaymentIdIn(scheduleId: String, paymentIds: Collection<Long>) =
        paymentMemberRepository.findAllByScheduleIdAndPaymentIdIn(scheduleId, paymentIds)

}