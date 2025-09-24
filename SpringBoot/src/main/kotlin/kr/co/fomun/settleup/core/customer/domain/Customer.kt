package kr.co.fomun.settleup.core.customer.domain

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
@Table(name = "TB_CU001")
open class Customer(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "CUT_ID", length = 10, nullable = false, unique = true)
    open var customerId: String = "",

    /** 멤버 이름 (VARCHAR(512), NOT NULL) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "NM", length = 512, nullable = false)
    open var name: String = "",

    /** 계좌 (VARCHAR(512)) */
    @Convert(converter = CryptoStringConverter::class)
    @Column(name = "ACCOUNT", length = 512)
    open var account: String? = null,

    @Embedded
    open var writer: Writer = Writer(),
)