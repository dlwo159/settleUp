package kr.co.fomun.settleup.core.schedule.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.security.crypto.CryptoStringConverter
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.domain.support.AuditingEntityListener

@Entity
@DynamicInsert
@DynamicUpdate
@EntityListeners(AuditingEntityListener::class)
@Table(
    name = "TB_SC001",
    indexes = [
        Index(name = "IDX_TB_SC001_SC_ID", columnList = "SC_ID"),
        Index(name = "IDX_TB_SC001_CUT_ID", columnList = "CUT_ID")
    ]
)
open class Schedule(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 일정 ID (CHAR(10), NOT NULL) */
    @Column(name = "SC_ID", length = 10, nullable = false, unique = true)
    open var scheduleId: String = "",

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "CUT_ID", length = 10, nullable = false)
    open var customerId: String = "",

    /** 일정명 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "TITLE", length = 512, nullable = false)
    open var title: String = "",

    /** 일정 날짜 (CHAR(10), NOT NULL, 예: "YYYY-MM-DD") */
    @Column(name = "DT", length = 10, nullable = false)
    open var date: String = "",

    /** 배경색 (CHAR(7), NOT NULL, 예: "#FFFFFF") */
    @Column(name = "COLOR", length = 7, nullable = false)
    open var color: String = "",

    /** 총 소요비 (BIGINT(20), NOT NULL, DEFAULT 0) */
    @Column(name = "TOTAL_COST", nullable = false)
    open var totalCost: Long = 0L,

    /** 삭제 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Column(name = "DEL_YN", length = 1, nullable = false)
    open var delYn: String = "N",

    @Embedded
    open var writer: Writer = Writer(),
)