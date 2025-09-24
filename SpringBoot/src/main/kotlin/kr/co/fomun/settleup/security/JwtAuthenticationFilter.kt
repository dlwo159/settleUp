package kr.co.fomun.settleup.security

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.servlet.DispatcherType
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.enum.TokenStatus.*
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.util.StringUtils
import org.springframework.web.filter.OncePerRequestFilter

class JwtAuthenticationFilter(
    private val jwtTokenProvider: JwtTokenProvider,
    private val objectMapper: ObjectMapper,
) : OncePerRequestFilter() {

    override fun shouldNotFilterErrorDispatch() = true
    override fun shouldNotFilterAsyncDispatch() = true

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain,
    ) {
        if (request.method.equals("OPTIONS", ignoreCase = true)) {
            filterChain.doFilter(request, response)
            return
        }
        if (request.dispatcherType != DispatcherType.REQUEST) {
            filterChain.doFilter(request, response)
            return
        }

        val accessToken = resolveToken(request)

        if (accessToken != null) {
            when (jwtTokenProvider.validateToken(accessToken)) {
                VALID -> {
                    val authentication = jwtTokenProvider.getAuthentication(accessToken)
                    SecurityContextHolder.getContext().authentication = authentication
                }

                EXPIRED, INVALID -> {
                    val jsonResultSet = JsonResultSet()
                    jsonResultSet.setFail("TOKEN_EXPIRED")
                    response.status = HttpServletResponse.SC_UNAUTHORIZED
                    response.contentType = "application/json;charset=UTF-8"
                    response.writer.write(objectMapper.writeValueAsString(jsonResultSet))
                    return
                }
            }
        }

        filterChain.doFilter(request, response)
    }

    private fun resolveToken(request: HttpServletRequest): String? {
        val bearerToken = request.getHeader("Authorization")

        return if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ", true)) {
            bearerToken.substring(7)
        } else {
            null
        }
    }
}