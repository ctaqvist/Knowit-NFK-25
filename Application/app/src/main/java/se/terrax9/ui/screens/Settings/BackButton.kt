import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import se.terrax9.R

@Composable
fun BackButton(navController: NavController) {

    val cornerRadius = 9.dp
    val gradientColors = listOf(Color(0x665526FF), Color(0x4DBCC5FF))

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(16.dp)
    ) {
        Box(
            modifier = Modifier
                .width(136.dp)
                .height(136.dp)
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
                    navController.popBackStack()
                }
        ) {
            Image(
                painter = painterResource(id = R.drawable.x),
                contentDescription = "Back Button",
                contentScale = ContentScale.None,
                modifier = Modifier
                    .padding(6.dp)
                    .width(89.27495.dp)
                    .height(86.8.dp)
            )
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Back to main",
            style = TextStyle(
                fontSize = 17.sp,
                fontFamily = FontFamily(Font(R.font.instrumentsans)),
                fontWeight = FontWeight(500),
                color = Color(0xFFFFFFFF),
                textAlign = TextAlign.Center,
                letterSpacing = 0.34.sp,
            ),
            modifier = Modifier.width(136.dp)
        )
    }
}

@Preview
@Composable
fun BackButtonPreview() {
    val navController = rememberNavController()
    BackButton(navController = navController)
}