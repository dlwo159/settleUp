import com.github.benmanes.caffeine.cache.Caffeine
import org.springframework.cache.CacheManager
import org.springframework.cache.caffeine.CaffeineCacheManager
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.util.concurrent.TimeUnit

@Configuration
class CaffeineCacheConfig {

    @Bean
    fun cacheManager(): CacheManager {
        // 공통 Caffeine 빌더 설정 (24시간 TTL)
        val caffeineBuilder = Caffeine.newBuilder()
            .expireAfterWrite(24, TimeUnit.HOURS) // 쓰기 후 24시간 뒤 만료
            .maximumSize(2_000)                  // 캐시 최대 엔트리 수 (환경에 맞게 조정)
            .recordStats()                        // 히트/미스 통계 (운영 시 모니터링에 유용)

        val manager = CaffeineCacheManager("systemCodes") // 캐시 이름 미리 선언 가능
        manager.setCaffeine(caffeineBuilder)
        manager.isAllowNullValues = false
        return manager
    }
}