package kr.co.fomun.settleup.core.paymentItem.repository

import kr.co.fomun.settleup.core.paymentItem.domain.PaymentItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface PaymentItemRepository : JpaRepository<PaymentItem, Long>, PaymentItemRepositoryCustom {
    fun findByScheduleIdAndPaymentId(scheduleId: String, paymentId: Long): PaymentItem?
}

interface PaymentItemRepositoryCustom {

    fun maxByPaymentId(scheduleId: String): Long

    fun findPageByScheduleIdAndAcceptYn(
        scheduleId: String,
        acceptYn: Boolean,
        pageable: Pageable
    ): Page<PaymentItem>

    fun findAllByScheduleIdAndAndAcceptYn(scheduleId: String, acceptYn: Boolean): List<PaymentItem>

    fun updatePayerByScheduleIdNPayerId(scheduleId: String, payerId: Long, name: String): Long

    fun countByScheduleIdAndAcceptYn(scheduleId: String, acceptYn: Boolean): Long

}