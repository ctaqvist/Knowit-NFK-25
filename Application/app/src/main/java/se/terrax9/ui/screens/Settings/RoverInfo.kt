import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import se.terrax9.R

@Composable
fun RoverInfo(username: String, roverSerial: String?) {
    Column(
        modifier = Modifier.padding(top = 100.dp),
        verticalArrangement = Arrangement.spacedBy(22.dp, Alignment.Top),
        horizontalAlignment = Alignment.Start,
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(7.dp, Alignment.Top)
            ){
            LabelText(text = "Username:")
            ValueText(text = username)
        }
        Column (
            verticalArrangement = Arrangement.spacedBy(7.dp, Alignment.Top)
        ) {
            LabelText(text = "Rover serial:")
            ValueText(text = roverSerial ?: "N/A")
        }
    }
}

@Composable
fun LabelText(text: String) {
    Text(
        text = text,
        style = TextStyle(
            fontSize = 17.sp,
            fontFamily = FontFamily(Font(R.font.instrumentsans)),
            fontWeight = FontWeight(400),
            color = Color(0xFFFFFFFF),
        )
    )
}

@Composable
fun ValueText(text: String) {
    Text(
        text = text,
        style = TextStyle(
            fontSize = 15.sp,
            fontFamily = FontFamily(Font(R.font.lexendera)),
            fontWeight = FontWeight(500),
            color = Color(0xFFFFFFFF),
        )
    )
}

@Preview
@Composable
fun RoverInfoPreview() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        RoverInfo(username = "Moji", roverSerial = "RF-162-RM-X")
    }
}