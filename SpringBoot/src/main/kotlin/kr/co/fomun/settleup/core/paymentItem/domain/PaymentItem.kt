package kr.co.fomun.settleup.core.paymentItem.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.core.common.common.BooleanYnConverter
import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.security.crypto.CryptoStringConverter
import org.springframework.data.jpa.domain.support.AuditingEntityListener

@Entity
@EntityListeners(AuditingEntityListener::class)
@Table(
    name = "TB_PA001",
    uniqueConstraints = [UniqueConstraint(name = "SC_ID_PA_ID", columnNames = ["SC_ID", "PA_ID"])],
    indexes = [Index(name = "IDX_PA001_SC_ID", columnList = "SC_ID")]
)
open class PaymentItem(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 일정 ID (CHAR(10), NOT NULL) */
    @Column(name = "SC_ID", length = 10, nullable = false)
    open var scheduleId: String = "",

    /** 결제 ID (BIGINT(20), NOT NULL) */
    @Column(name = "PA_ID", nullable = false)
    open var paymentId: Long = 0L,

    /** 결제자 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "PAYER", length = 512, nullable = false)
    open var payer: String = "",

    /** 결제자 ID (BIGINT(20), NOT NULL) */
    @Column(name = "PAYER_ID", nullable = false)
    open var payerId: Long = 0L,

    /** 결제명 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "TITLE", length = 512, nullable = false)
    open var title: String = "",

    /** 결제 금액 (BIGINT(20), NOT NULL, DEFAULT 0) */
    @Column(name = "COST", nullable = false)
    open var cost: Long = 0L,

    /** 수락 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Convert(converter = BooleanYnConverter::class)
    @Column(name = "ACCEPT_YN", length = 1, nullable = false)
    open var acceptYn: Boolean = false,

    /** 삭제 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Convert(converter = BooleanYnConverter::class)
    @Column(name = "DEL_YN", length = 1, nullable = false)
    open var delYn: Boolean = false,

    @Embedded
    open var writer: Writer = Writer(),
)