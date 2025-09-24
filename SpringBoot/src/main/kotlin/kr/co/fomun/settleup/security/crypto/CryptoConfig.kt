package kr.co.fomun.settleup.security.crypto

import org.springframework.beans.factory.InitializingBean
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration

@Configuration
class CryptoConfig(
    @Value("\${app.crypto.key-base64}") private val keyBase64: String
) : InitializingBean {
    override fun afterPropertiesSet() {
        Crypto.init(keyBase64) // 앱 시작 시 키 주입
    }
}