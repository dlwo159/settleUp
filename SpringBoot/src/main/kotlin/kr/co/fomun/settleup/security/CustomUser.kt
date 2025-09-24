package kr.co.fomun.settleup.security

import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.userdetails.UserDetails

class CustomUser(
    val userId: String,
    private val password: String? = null,
    private val authorities: Collection<GrantedAuthority>
) : UserDetails {
    override fun getUsername(): String = userId
    override fun getPassword(): String? = password
    override fun getAuthorities(): Collection<GrantedAuthority> = authorities

    override fun isAccountNonExpired(): Boolean = true
    override fun isAccountNonLocked(): Boolean = true
    override fun isCredentialsNonExpired(): Boolean = true
    override fun isEnabled(): Boolean = true
}