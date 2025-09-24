package kr.co.fomun.settleup.security

import kr.co.fomun.settleup.core.common.common.enum.TokenStatus
import kr.co.fomun.settleup.dto.authority.TokenInfo
import io.jsonwebtoken.*
import io.jsonwebtoken.io.Decoders
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.Authentication
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.Cipher
import javax.crypto.spec.SecretKeySpec

const val EXPIRATION_MILLISECONDS: Long = 1000 * 60 * 5 //5분
const val REFRESH_EXPIRATION_MILLISECONDS: Long = 1000 * 60 * 60 * 24 * 2 //2일
//const val EXPIRATION_MILLISECONDS: Long = 1000 * 10
//const val REFRESH_EXPIRATION_MILLISECONDS: Long = 1000 * 30

@Component
class JwtTokenProvider {
    @Value("\${jwt.secret}")
    lateinit var secretKey: String

    private val key by lazy { Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey)) }

    /**
     * Token 생성
     */
    fun createToken(customerId: String): TokenInfo {
        val now = Date()
        val accessExpiration = Date(now.time + EXPIRATION_MILLISECONDS)
        val refreshExpiration = Date(now.time + REFRESH_EXPIRATION_MILLISECONDS)

        val userId = aesEncrypt(customerId)
        val role = aesEncrypt("ROLE_USER")

        // Access Token
        val accessToken = Jwts
            .builder()
            .claim("userId", userId)
            .claim("role", role)
            .setIssuedAt(now)
            .setExpiration(accessExpiration)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()

        // Refresh Token
        val refreshToken = Jwts
            .builder()
            .claim("userId", userId)
            .setIssuedAt(now)
            .setExpiration(refreshExpiration)
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()

        return TokenInfo("Bearer", accessToken, refreshToken)
    }

    /**
     * Token 정보 추출
     */
    fun getAuthentication(token: String): Authentication {
        val claims: Claims = getClaims(token)

        val userId = aesDecrypt(claims["userId"].toString())
        val role = aesDecrypt(claims["role"].toString())

        // 권한 정보 추출
        val authorities: Collection<GrantedAuthority> = listOf(SimpleGrantedAuthority(role))

        val principal: UserDetails = CustomUser(userId, "", authorities)

        return UsernamePasswordAuthenticationToken(principal, "", authorities)
    }

    /**
     * Token 검증
     */
    fun validateToken(token: String): TokenStatus {
        try {
            getClaims(token)
            return TokenStatus.VALID
        } catch (e: Exception) {
            when (e) {
                is SecurityException -> {}  // Invalid JWT Token
                is MalformedJwtException -> {}  // Invalid JWT Token
                is ExpiredJwtException -> {
                    return TokenStatus.EXPIRED
                }    // Expired JWT Token
                is UnsupportedJwtException -> {}    // Unsupported JWT Token
                is IllegalArgumentException -> {}   // JWT claims string is empty
                else -> {}  // else
            }
        }
        return TokenStatus.INVALID
    }

    private fun getClaims(token: String): Claims =
        Jwts.parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .body

    fun getUserIdByDecrypt(token: String): String {
        val claims: Claims = getClaims(token)

        return aesDecrypt(claims["userId"].toString())
    }

    fun aesEncrypt(data: String): String {
        val keySpec = SecretKeySpec(secretKey.substring(13, 29).toByteArray(Charsets.UTF_8), "AES")
        val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.ENCRYPT_MODE, keySpec)
        val encrypted = cipher.doFinal(data.toByteArray(Charsets.UTF_8))
        return Base64.getEncoder().encodeToString(encrypted)
    }

    fun aesDecrypt(encryptedData: String): String {
        val keySpec = SecretKeySpec(secretKey.substring(13, 29).toByteArray(Charsets.UTF_8), "AES")
        val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.DECRYPT_MODE, keySpec)
        val decodedBytes = Base64.getDecoder().decode(encryptedData)
        val decrypted = cipher.doFinal(decodedBytes)
        return String(decrypted, Charsets.UTF_8)
    }
}