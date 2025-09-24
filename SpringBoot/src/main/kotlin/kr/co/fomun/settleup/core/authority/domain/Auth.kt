package kr.co.fomun.settleup.core.authority.domain

import jakarta.persistence.*
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.LocalDateTime

@Entity
@DynamicInsert
@DynamicUpdate
@EntityListeners(AuditingEntityListener::class)
@Table(name = "TB_AU001")
open class Auth(
    /**  (BIGINT(20), PK, AUTO_INCREMENT) */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    open var id: Long? = null,

    /** 토큰 값 (VARCHAR(50), NOT NULL) */
    @Column(name = "TOKEN", length = 50, nullable = false, unique = true)
    open var token: String = "",

    /** 회원 ID (CHAR(10), NOT NULL) */
    @Column(name = "CUT_ID", length = 10, nullable = false)
    open var customerId: String = "",

    /** 로그인 구분 (VARCHAR(6), NOT NULL, DEFAULT 'LOCAL') */
    @Column(name = "TP", length = 6, nullable = false)
    open var type: String = "LOCAL",

    /** 수정일 (DATETIME, NOT NULL) */
    @LastModifiedDate
    @Column(name = "LAST_LOGIN_DT", nullable = false)
    open var lastLoginDate: LocalDateTime = LocalDateTime.now(),
)