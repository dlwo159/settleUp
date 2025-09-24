package kr.co.fomun.settleup.config

import kr.co.fomun.settleup.security.CustomUser
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import org.springframework.security.core.context.SecurityContextHolder
import java.util.Optional

@Configuration
@EnableJpaAuditing
class AuditingConfig {

    @Bean
    fun auditorProvider(): AuditorAware<String> = AuditorAware {
        val auth = SecurityContextHolder.getContext().authentication
        val userId = (auth?.principal as? CustomUser)?.userId
        Optional.ofNullable(userId)
    }
}