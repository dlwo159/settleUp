package kr.co.fomun.settleup.core.common.common

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import java.time.LocalDateTime

@Embeddable
class Writer(
    /** 등록자 ID (CHAR(10), NOT NULL) */
    @CreatedBy
    @Column(name = "REG_ID", nullable = false, length = 10, updatable = false)
    var regUserId: String = "",

    /** 등록일 (DATETIME, NOT NULL) */
    @CreatedDate
    @Column(name = "REG_DT", nullable = false, updatable = false)
    var regDate: LocalDateTime = LocalDateTime.now(),

    /** 수정자 ID (CHAR(10), NOT NULL) */
    @LastModifiedBy
    @Column(name = "UPD_ID", nullable = false, length = 10)
    var updUserId: String = "",

    /** 수정일 (DATETIME, NOT NULL) */
    @LastModifiedDate
    @Column(name = "UPD_DT", nullable = false)
    var updDate: LocalDateTime = LocalDateTime.now(),
) {
    constructor(userId: String) : this(
        regUserId = userId,
        regDate = LocalDateTime.now(),
        updUserId = userId,
        updDate = LocalDateTime.now()
    )

    fun update(updUserId: String) {
        this.updUserId = updUserId
        this.updDate = LocalDateTime.now()
    }
}