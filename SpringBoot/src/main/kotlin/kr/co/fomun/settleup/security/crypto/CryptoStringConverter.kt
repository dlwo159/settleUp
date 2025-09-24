package kr.co.fomun.settleup.security.crypto

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter(autoApply = false)
class CryptoStringConverter : AttributeConverter<String?, String?> {

    override fun convertToDatabaseColumn(attribute: String?): String? {
        return Crypto.encrypt(attribute?.toByteArray(Charsets.UTF_8))
    }

    override fun convertToEntityAttribute(dbData: String?): String? {
        return Crypto.decrypt(dbData)?.toString(Charsets.UTF_8)
    }
}