package kr.co.fomun.settleup.core.schedule.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.core.common.common.BooleanYnConverter
import kr.co.fomun.settleup.security.crypto.CryptoStringConverter
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate

@Entity
@DynamicInsert
@DynamicUpdate
@Table(
    name = "TB_ME001",
    uniqueConstraints = [UniqueConstraint(name = "SC_ID_MEM_ID", columnNames = ["SC_ID", "MEM_ID"])],
    indexes = [Index(name = "IDX_ME001_SC_ID", columnList = "SC_ID")]
)
open class ScheduleMember(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 일정 ID (CHAR(10), NOT NULL) */
    @Column(name = "SC_ID", length = 10, nullable = false)
    open var scheduleId: String = "",

    /** 멤버 MEM_ID (BIGINT(20), NOT NULL) */
    @Column(name = "MEM_ID", nullable = false)
    open var memberId: Long = 0L,

    /** 멤버 이름 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "NM", length = 512, nullable = false)
    open var name: String = "",

    /** 결제자 여부 (CHAR(1), NOT NULL, DEFAULT N) */
    @Convert(converter = BooleanYnConverter::class)
    @Column(name = "PAYER_YN", length = 1, nullable = false)
    open var payerYn: Boolean = false,

    /** 계좌 (VARCHAR(512)) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "ACCOUNT", length = 512)
    open var account: String? = null,
)