package kr.co.fomun.settleup.core.common.common

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter(autoApply = false)
class BooleanYnConverter : AttributeConverter<Boolean, String> {
    override fun convertToDatabaseColumn(attribute: Boolean?): String =
        if (attribute == true) "Y" else "N"

    override fun convertToEntityAttribute(dbData: String?): Boolean =
        dbData?.equals("Y", ignoreCase = true) == true
}