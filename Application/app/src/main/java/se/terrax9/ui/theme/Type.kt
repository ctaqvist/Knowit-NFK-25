package se.terrax9.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import se.terrax9.R


val LexendExa = FontFamily(Font(R.font.lexendera))
val InstrumentSans = FontFamily(Font(R.font.instrumentsans))

// ChatGPT generated :)
// Slightly increased font size compared to slides to fit tablet better
val Typography = Typography(
    // Headlines & Titles
    displayLarge = TextStyle(
        fontFamily = LexendExa,
        fontWeight = FontWeight.Bold,
        fontSize = 72.sp
    ),
    displayMedium = TextStyle(
        fontFamily = LexendExa,
        fontWeight = FontWeight.Bold,
        fontSize = 56.sp
    ),
    displaySmall = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Bold,
        fontSize = 44.sp
    ),

    // Subheadings
    headlineMedium = TextStyle(
        fontFamily = LexendExa,
        fontWeight = FontWeight.Medium,
        fontSize = 32.sp
    ),
    headlineSmall = TextStyle(
        fontFamily = LexendExa,
        fontWeight = FontWeight.Normal,
        fontSize = 28.sp
    ),

    // Buttons & CTAs
    labelLarge = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp
    ),

    // Body text
    bodyLarge = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Normal,
        fontSize = 20.sp
    ),
    bodyMedium = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Normal,
        fontSize = 18.sp
    ),
    bodySmall = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp
    ),

    // Navigation, Forms, Menus, Links
    titleMedium = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Medium,
        fontSize = 16.sp
    ),
    titleSmall = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp
    ),

    // Highlighted text, captions, etc
    labelMedium = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Bold,
        fontSize = 16.sp
    ),
    labelSmall = TextStyle(
        fontFamily = InstrumentSans,
        fontWeight = FontWeight.Medium,
        fontSize = 14.sp
    )
)