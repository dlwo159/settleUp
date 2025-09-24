package kr.co.fomun.settleup.core.common.repository

import kr.co.fomun.settleup.core.common.domain.SystemCode
import org.springframework.data.jpa.repository.JpaRepository

interface SystemCodeRepository : JpaRepository<SystemCode, String>