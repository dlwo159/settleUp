package kr.co.fomun.settleup.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.DispatcherType
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource


@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
class SecurityConfig(
    private val jwtTokenProvider: JwtTokenProvider,
    private val objectMapper: ObjectMapper,
) {
    @Bean
    fun filterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // 에러/포워드 디스패치 전부 허용
                it.dispatcherTypeMatchers(DispatcherType.ERROR, DispatcherType.FORWARD).permitAll()
                // 스프링 부트 기본 에러 엔드포인트도 허용
                it.requestMatchers("/error").permitAll()
                it.requestMatchers("/api/index", "/api/code/**", "/api/auth/**", "/api/guest/**").permitAll()
//                it.requestMatchers("/api/index").anonymous()
//                it.anyRequest().authenticated()
                it.anyRequest().hasRole("USER")
            }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .logout { it.disable() }
            .addFilterBefore(
                JwtAuthenticationFilter(jwtTokenProvider, objectMapper),
                UsernamePasswordAuthenticationFilter::class.java
            )

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val config = CorsConfiguration()
        config.allowedOrigins = listOf("http://localhost:5173", "http://127.0.0.1:5173") // 정확한 Origin 명시
        config.allowCredentials = true

        config.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        config.allowedHeaders = listOf("*")
        config.maxAge = 3600L

        config.exposedHeaders = listOf("Authorization", "Access-Token", "Refresh-Token") // 필요 시

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", config)
        return source
    }

    @Bean
    fun userDetailsService(): UserDetailsService =
        UserDetailsService { _ -> throw UsernameNotFoundException("Username/Password auth is disabled") }

}