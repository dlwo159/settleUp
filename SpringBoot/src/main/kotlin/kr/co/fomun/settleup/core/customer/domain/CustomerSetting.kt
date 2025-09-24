package kr.co.fomun.settleup.core.customer.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.core.common.common.Writer
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.domain.support.AuditingEntityListener

@Entity
@DynamicInsert
@DynamicUpdate
@EntityListeners(AuditingEntityListener::class)
@Table(name = "TB_CU002")
open class CustomerSetting(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "CUT_ID", length = 10, nullable = false, unique = true)
    open var customerId: String = "",

    /** 화면 방식 (CHAR(1), NOT NULL, DEFAULT '1') */
    @Column(name = "VIEW_TY", length = 1, nullable = false)
    open var viewType: String = "1",

    /** 이용안내 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Column(name = "HELP_YN", length = 1, nullable = false)
    open var helpYn: String = "N",

    /** 결제자 송금 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Column(name = "PAYER_SEND_YN", length = 1, nullable = false)
    open var payerSendYn: String = "N",

    /** 소수점 처리(1:올림,2:반올림,3:내림) (CHAR(1), NOT NULL, DEFAULT '2') */
    @Column(name = "DEC_PT", length = 1, nullable = false)
    open var decimalPoint: String = "2",

    /** 절삭 처리(0:없음,1:1원,10:10원) (Int(11), NOT NULL, DEFAULT '0') */
    @Column(name = "CUT", nullable = false)
    open var cutting: Int = 1,

    /** 절삭 여부 (CHAR(1), NOT NULL, DEFAULT 'N') */
    @Column(name = "CUT_YN", length = 1, nullable = false)
    open var cuttingYn: String = "N",

    @Embedded
    open var writer: Writer = Writer(),
)