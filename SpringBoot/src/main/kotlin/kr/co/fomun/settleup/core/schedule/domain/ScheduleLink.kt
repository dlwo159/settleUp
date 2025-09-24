package kr.co.fomun.settleup.core.schedule.domain

import jakarta.persistence.*
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate

@Entity
@DynamicInsert
@DynamicUpdate
@Table(
    name = "TB_SC002",
    uniqueConstraints = [
        UniqueConstraint(name = "UX_SC002_SC_ID", columnNames = ["SC_ID"]),
        UniqueConstraint(name = "UX_SC002_LINK_CD", columnNames = ["LINK_CD"])
    ]
)
open class ScheduleLink(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 일정 ID (CHAR(10), NOT NULL) */
    @Column(name = "SC_ID", length = 10, nullable = false)
    open var scheduleId: String = "",

    /** 링크 코드 (CHAR(10), NOT NULL) */
    @Column(name = "LINK_CD", length = 10, nullable = false)
    open var lineCode: String = "",

    /** 마감 날짜 (CHAR(10), NOT NULL, 예: "YYYY-MM-DD") */
    @Column(name = "CLOSE_DT", length = 10, nullable = false)
    open var closeDate: String = "",
)