import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import se.terrax9.R

@Composable
fun SettingsButton(
    text: String = "",
    iconRes: Int,
    onClick: (() -> Unit)
) {
    val cornerRadius = 9.dp
    val gradientColors = listOf(Color(0x665526FF), Color(0x4DBCC5FF))

    Box(
        modifier = Modifier
            .width(183.dp)
            .height(183.dp)
            .background(
                brush = Brush.verticalGradient(gradientColors),
                shape = RoundedCornerShape(cornerRadius)
            )
            .border(
                width = 1.dp,
                color = Color(0xFFFFFFFF),
                shape = RoundedCornerShape(cornerRadius)
            )
            .padding(16.dp)
            .clickable {
                onClick()
            }
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center,
            modifier = Modifier.fillMaxSize()
        ) {
            Image(
                painter = painterResource(iconRes),
                contentDescription = null,
                modifier = Modifier
                    .size(78.dp)
                    .padding(bottom = 28.dp)
            )
            Text(
                text = text,
                color = Color.White,
                fontSize = 15.sp,
                fontFamily = FontFamily(Font(R.font.lexendera))
            )
        }
    }
}

@Preview
@Composable
fun IconButtonPreview() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        SettingsButton(
            text = "Lights",
            iconRes = R.drawable.camera
        ) {
            // Handle click action here
        }
    }
}