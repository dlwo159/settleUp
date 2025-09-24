package kr.co.fomun.settleup.core.paymentItem.repository

import kr.co.fomun.settleup.core.paymentItem.domain.PaymentMember
import org.springframework.data.jpa.repository.JpaRepository

interface PaymentMemberRepository : JpaRepository<PaymentMember, Long>, PaymentMemberRepositoryCustom {
    fun findAllByScheduleIdAndPaymentId(scheduleId: String, paymentId: Long): List<PaymentMember>

    fun findAllByScheduleIdAndPaymentIdIn(scheduleId: String, paymentIds: Collection<Long>): List<PaymentMember>
}

interface PaymentMemberRepositoryCustom {

    fun deleteByScheduleIdAndMemberId(scheduleId: String, memberId: Long): Long

    fun deleteByScheduleIdAndPaymentId(scheduleId: String, paymentId: Long): Long

    fun updateNameByScheduleIdNMemberId(scheduleId: String, memberId: Long, name: String): Long
}