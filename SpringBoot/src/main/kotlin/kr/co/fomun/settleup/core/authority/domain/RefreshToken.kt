package kr.co.fomun.settleup.core.authority.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "TB_AU002")
open class RefreshToken(
    /** 회원 ID (CHAR(10), NOT NULL) */
    @Id
    @Column(name = "CUT_ID", length = 10, nullable = false)
    open var customerId: String = "",

    /** 갱신 토큰 (VARCHAR(300), NOT NULL) */
    @Column(name = "RE_TOKEN", length = 300, nullable = false)
    open var refreshToken: String = "",
)