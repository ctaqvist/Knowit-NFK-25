package se.emilkronholm.terrax9.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext

val ColorScheme = darkColorScheme(
    primary = AppColors.Primary,
    onPrimary = AppColors.Light,

    secondary = AppColors.SecondaryLight,
    onSecondary = AppColors.Dark,

    tertiary = AppColors.SecondaryDark,
    onTertiary = AppColors.Light,

    background = AppColors.Dark,
    onBackground = AppColors.Light,

    surface = AppColors.Dark,
    onSurface = AppColors.Light
)


@Composable
fun Terrax9Theme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = ColorScheme,
        typography = Typography,
        content = content
    )
}