package kr.co.fomun.settleup.core.schedule.repository

import com.querydsl.jpa.impl.JPAQueryFactory
import kr.co.fomun.settleup.core.schedule.domain.QScheduleMember
import kr.co.fomun.settleup.core.schedule.domain.ScheduleMember
import org.springframework.stereotype.Repository

@Repository
class ScheduleMemberRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : ScheduleMemberRepositoryCustom {

    override fun maxByMemberId(scheduleId: String): Long {
        val qScheduleMember = QScheduleMember.scheduleMember

        return jpaQueryFactory
            .select(qScheduleMember.memberId.max())
            .from(qScheduleMember)
            .where(qScheduleMember.scheduleId.eq(scheduleId))
            .fetchFirst() ?: 0L
    }

    override fun updateByScheduleIdAndMemberId(scheduleMember: ScheduleMember): Long {
        val qScheduleMember = QScheduleMember.scheduleMember

        return jpaQueryFactory
            .update(qScheduleMember)
            .set(qScheduleMember.name, scheduleMember.name)
            .set(qScheduleMember.payerYn, scheduleMember.payerYn)
            .set(qScheduleMember.account, scheduleMember.account)
            .where(
                qScheduleMember.scheduleId.eq(scheduleMember.scheduleId),
                qScheduleMember.memberId.eq(scheduleMember.memberId)
            )
            .execute()
    }
}