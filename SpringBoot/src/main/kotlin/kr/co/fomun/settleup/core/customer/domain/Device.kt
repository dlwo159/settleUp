package kr.co.fomun.settleup.core.customer.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.DynamicInsert
import org.hibernate.annotations.DynamicUpdate

@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "TB_CU003")
open class Device(
    /** 회원 ID (CHAR(10), NOT NULL) */
    @Id
    @Column(name = "CUT_ID", length = 10, nullable = false)
    open var customerId: String = "",

    /** 기기 모델명 (VARCHAR(50), NOT NULL) */
    @Column(name = "MODEL", length = 50)
    open var model: String? = null,

    /** OS (VARCHAR(3), NOT NULL) */
    @Column(name = "OS", length = 3)
    open var os: String? = null,

    /** 시스템 버전 (VARCHAR(50), NOT NULL) */
    @Column(name = "SYS_VER", length = 50)
    open var systemVersion: String? = null,

    /** 푸쉬 토큰 (VARCHAR(200), NOT NULL) */
    @Column(name = "PUSH_TOKEN", length = 200)
    open var pushToken: String? = null,
)