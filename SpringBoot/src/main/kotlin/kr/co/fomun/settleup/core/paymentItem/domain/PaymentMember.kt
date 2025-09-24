package kr.co.fomun.settleup.core.paymentItem.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.security.crypto.CryptoStringConverter

@Entity
@Table(
    name = "TB_PA002",
    uniqueConstraints = [UniqueConstraint(name = "SC_ID_PA_ID_MEM_ID", columnNames = ["SC_ID", "PA_ID", "MEM_ID"])],
    indexes = [Index(name = "IDX_PA002_SC_ID_PA_ID", columnList = "SC_ID,PA_ID")],
)
open class PaymentMember(
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

    /** 멤버 ID (BIGINT(20), NOT NULL) */
    @Column(name = "MEM_ID", nullable = false)
    open var memberId: Long = 0L,

    /** 멤버 이름 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "NM", length = 512, nullable = false)
    open var name: String = "",
)