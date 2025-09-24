package kr.co.fomun.settleup.security.crypto

import java.security.SecureRandom
import java.util.Base64
import javax.crypto.Cipher
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec
import javax.crypto.spec.SecretKeySpec

object Crypto {
    // 32바이트(256bit) 키 권장. 환경변수/Secret Manager에서 읽어서 설정.
    @Volatile private var key: SecretKey? = null
    private const val ALGO = "AES"
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val GCM_TAG_LENGTH_BIT = 128
    private val random = SecureRandom()

    fun init(base64Key: String) {
        val raw = Base64.getDecoder().decode(base64Key)
        require(raw.size == 16 || raw.size == 32) { "AES key must be 128 or 256 bits" }
        key = SecretKeySpec(raw, ALGO)
    }

    fun encrypt(plain: ByteArray?): String? {
        if (plain == null) return null
        val k = requireNotNull(key) { "Crypto key not initialized" }
        val iv = ByteArray(12).also { random.nextBytes(it) } // 96-bit IV 권장
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.ENCRYPT_MODE, k, GCMParameterSpec(GCM_TAG_LENGTH_BIT, iv))
        val ciphertext = cipher.doFinal(plain)
        // 저장형식: base64(iv || ciphertext)
        val out = ByteArray(iv.size + ciphertext.size)
        System.arraycopy(iv, 0, out, 0, iv.size)
        System.arraycopy(ciphertext, 0, out, iv.size, ciphertext.size)
        return Base64.getEncoder().encodeToString(out)
    }

    fun decrypt(stored: String?): ByteArray? {
        if (stored == null) return null
        val k = requireNotNull(key) { "Crypto key not initialized" }
        val all = Base64.getDecoder().decode(stored)
        require(all.size > 12) { "cipher too short" }
        val iv = all.copyOfRange(0, 12)
        val cipherText = all.copyOfRange(12, all.size)
        val cipher = Cipher.getInstance(TRANSFORMATION)
        cipher.init(Cipher.DECRYPT_MODE, k, GCMParameterSpec(GCM_TAG_LENGTH_BIT, iv))
        return cipher.doFinal(cipherText)
    }
}