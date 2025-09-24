package kr.co.fomun.settleup.core.schedule.repository

import com.querydsl.jpa.impl.JPAQueryFactory
import kr.co.fomun.settleup.core.schedule.domain.QSchedule
import org.springframework.stereotype.Repository

@Repository
class ScheduleRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : ScheduleRepositoryCustom {
    override fun makeByScheduleId(): String {
        val qSchedule = QSchedule.schedule

        val maxScheduleId = jpaQueryFactory
            .select(qSchedule.scheduleId.max())
            .from(qSchedule)
            .fetchFirst() ?: "S000000000"

        return makeScheduleId(maxScheduleId)
    }

    fun makeScheduleId(maxScheduleId: String): String {
        val newSeq = maxScheduleId.substring(1).toInt() + 1
        return "S" + newSeq.toString().padStart(9, '0')
    }

    override fun updateTotalCostByScheduleId(scheduleId: String, totalCost: Long): Long {
        val qSchedule = QSchedule.schedule

        return jpaQueryFactory
            .update(qSchedule)
            .set(qSchedule.totalCost, totalCost)
            .where(qSchedule.scheduleId.eq(scheduleId))
            .execute()
    }
}