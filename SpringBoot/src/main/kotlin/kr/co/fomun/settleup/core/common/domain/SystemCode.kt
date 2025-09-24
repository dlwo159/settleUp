package kr.co.fomun.settleup.core.common.domain

import jakarta.persistence.*
import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.security.crypto.CryptoStringConverter
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.domain.support.AuditingEntityListener

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "TB_CD001")
open class SystemCode(
    /** 회원 ID (CHAR(10), NOT NULL) */
    @Id
    @Column(name = "CD", length = 6, nullable = false)
    open var code: String = "",

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "HI_CD", length = 6, nullable = false)
    open var highCode: String = "",

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "VALUE", length = 50, nullable = false)
    open var value: String = "",
)