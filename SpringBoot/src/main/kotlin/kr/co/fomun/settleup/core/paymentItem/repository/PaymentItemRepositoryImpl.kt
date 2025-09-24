package kr.co.fomun.settleup.core.paymentItem.repository

import com.querydsl.jpa.impl.JPAQueryFactory
import kr.co.fomun.settleup.core.paymentItem.domain.PaymentItem
import kr.co.fomun.settleup.core.paymentItem.domain.QPaymentItem
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository

@Repository
class PaymentItemRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : PaymentItemRepositoryCustom {

    override fun maxByPaymentId(scheduleId: String): Long {
        val qPaymentItem = QPaymentItem.paymentItem

        return jpaQueryFactory
            .select(qPaymentItem.paymentId.max())
            .from(qPaymentItem)
            .where(qPaymentItem.scheduleId.eq(scheduleId))
            .fetchFirst() ?: 0L
    }

    override fun findPageByScheduleIdAndAcceptYn(
        scheduleId: String,
        acceptYn: Boolean,
        pageable: Pageable
    ): Page<PaymentItem> {
        val qPaymentItem = QPaymentItem.paymentItem

        val where = listOfNotNull(
            qPaymentItem.scheduleId.eq(scheduleId),
            qPaymentItem.acceptYn.eq(acceptYn),
            qPaymentItem.delYn.eq(false)
        )

        val total = jpaQueryFactory
            .select(qPaymentItem.id.count())
            .from(qPaymentItem)
            .where(*where.toTypedArray())
            .fetchOne() ?: 0L

        if (total == 0L) return PageImpl(emptyList(), pageable, 0)

        val content = jpaQueryFactory
            .selectFrom(qPaymentItem)
            .where(*where.toTypedArray())
            .orderBy(qPaymentItem.paymentId.desc())
            .offset(pageable.offset)
            .limit(pageable.pageSize.toLong())
            .fetch()

        return PageImpl(content, pageable, total)
    }

    override fun findAllByScheduleIdAndAndAcceptYn(scheduleId: String, acceptYn: Boolean): List<PaymentItem> {
        val qPaymentItem = QPaymentItem.paymentItem

        return jpaQueryFactory
            .select(qPaymentItem)
            .from(qPaymentItem)
            .where(
                qPaymentItem.scheduleId.eq(scheduleId),
                qPaymentItem.acceptYn.eq(acceptYn),
                qPaymentItem.delYn.eq(false)
            )
            .orderBy(qPaymentItem.paymentId.desc())
            .fetch()
    }

    override fun updatePayerByScheduleIdNPayerId(scheduleId: String, payerId: Long, name: String): Long {
        val qPaymentItem = QPaymentItem.paymentItem

        return jpaQueryFactory
            .update(qPaymentItem)
            .set(qPaymentItem.payer, name)
            .where(
                qPaymentItem.scheduleId.eq(scheduleId),
                qPaymentItem.payerId.eq(payerId)
            )
            .execute()
    }

    override fun countByScheduleIdAndAcceptYn(scheduleId: String, acceptYn: Boolean): Long {
        val qPaymentItem = QPaymentItem.paymentItem

        return jpaQueryFactory
            .select(qPaymentItem.count())
            .from(qPaymentItem)
            .where(
                qPaymentItem.scheduleId.eq(scheduleId),
                qPaymentItem.acceptYn.eq(acceptYn),
                qPaymentItem.delYn.eq(false)
            )
            .fetchOne() ?: 0L
    }
}