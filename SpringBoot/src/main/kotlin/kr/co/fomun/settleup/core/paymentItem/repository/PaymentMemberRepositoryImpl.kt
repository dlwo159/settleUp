package kr.co.fomun.settleup.core.paymentItem.repository

import com.querydsl.jpa.impl.JPAQueryFactory
import kr.co.fomun.settleup.core.paymentItem.domain.QPaymentMember
import org.springframework.stereotype.Repository

@Repository
class PaymentMemberRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : PaymentMemberRepositoryCustom {

    override fun deleteByScheduleIdAndMemberId(scheduleId: String, memberId: Long): Long {
        val qPaymentMember = QPaymentMember.paymentMember

        return jpaQueryFactory
            .delete(qPaymentMember)
            .where(
                qPaymentMember.scheduleId.eq(scheduleId),
                qPaymentMember.memberId.eq(memberId)
            )
            .execute()
    }

    override fun deleteByScheduleIdAndPaymentId(scheduleId: String, paymentId: Long): Long {
        val qPaymentMember = QPaymentMember.paymentMember

        return jpaQueryFactory
            .delete(qPaymentMember)
            .where(
                qPaymentMember.scheduleId.eq(scheduleId),
                qPaymentMember.paymentId.eq(paymentId)
            )
            .execute()
    }

    override fun updateNameByScheduleIdNMemberId(scheduleId: String, memberId: Long, name: String): Long {
        val qPaymentMember = QPaymentMember.paymentMember

        return jpaQueryFactory
            .update(qPaymentMember)
            .set(qPaymentMember.name, name)
            .where(
                qPaymentMember.scheduleId.eq(scheduleId),
                qPaymentMember.memberId.eq(memberId)
            )
            .execute()
    }
}