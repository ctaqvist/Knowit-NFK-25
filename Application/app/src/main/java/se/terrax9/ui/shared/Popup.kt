package se.terrax9.ui.shared

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.sizeIn
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
import se.terrax9.R

@Composable
fun PopupView(iconRes: Int,
              title: String,
              description: String,
              onDismiss: () -> Unit,
              buttonOneText: String? = null,
              buttonOneColor: Color = Color(0xFF5526FF),
              buttonTwoText: String? = null,
              buttonTwoColor: Color = Color(0xFF5526FF),
              onButtonOneClick: (() -> Unit)? = null,
              onButtonTwoClick: (() -> Unit)? = null) {

    val gradientColors = listOf(Color(0xFF05030C), Color(0xFF180757))

    Box (
        Modifier
            .background(Brush.linearGradient(colors = gradientColors), shape = RoundedCornerShape(size = 11.dp))
            .border(
                width = 1.dp,
                color = Color(0xFFFFFFFF),
                shape = RoundedCornerShape(size = 11.dp)
            )
            .sizeIn(minWidth = 400.dp, minHeight = 300.dp, maxWidth = 500.dp),
        contentAlignment = Alignment.Center

    ) {
        Column (
            verticalArrangement = Arrangement.spacedBy(30.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.padding(60.dp)
        ) {
            PopupIcon(iconRes = iconRes, modifier = Modifier.padding(bottom = 60.dp))
            PopupHeaderText(text = title, modifier = Modifier.padding(bottom = 60.dp))
            PopupBodyText(text = description, modifier = Modifier.padding(bottom = 60.dp))
            Row (
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                if(buttonOneText != null) {
                    PopupButton(text = buttonOneText, onClick = {
                        onButtonOneClick?.invoke()
                        onDismiss()
                    }, color = buttonOneColor)
                }
                if(buttonTwoText != null) {
                    PopupButton(text = buttonTwoText, onClick = {
                        onButtonTwoClick?.invoke()
                        onDismiss()
                    }, color = buttonTwoColor)
                }
            }
        }
    }
}

@Composable
fun PopupHeaderText(text: String, modifier: Modifier) {
    Text(
        text = text,
        modifier = Modifier,
        style = TextStyle(
            fontSize = 22.sp,
            fontFamily = FontFamily(Font(R.font.lexendera)),
            fontWeight = FontWeight(500),
            color = Color(0xFFFFFFFF),
            textAlign = TextAlign.Center,
        )
    )
}

@Composable
fun PopupBodyText(text: String, modifier: Modifier = Modifier) {
    Text(
        text = text,
        modifier = Modifier,
        style = TextStyle(
            fontSize = 14.sp,
            fontFamily = FontFamily(Font(R.font.instrumentsans)),
            fontWeight = FontWeight(400),
            color = Color(0xFFFFFFFF),
            textAlign = TextAlign.Center,
            letterSpacing = 0.7.sp,
        )
    )
}

@Composable
fun PopupIcon(iconRes: Int, modifier: Modifier) {
    Image(
        modifier = Modifier,
        painter = painterResource(id = iconRes),
        contentDescription = "image description",
        contentScale = ContentScale.None
    )
}

@Composable
fun PopupButton(text: String, onClick: () -> Unit, color: Color) {
    Box (
        Modifier
            .sizeIn(minWidth = 83.dp, minHeight = 38.dp)
            .background(color = color, shape = RoundedCornerShape(size = 11.dp))
            .padding(start = 14.dp, top = 12.dp, end = 14.dp, bottom = 12.dp)
            .clickable { onClick() },
        contentAlignment = Alignment.Center
    ) {
        PopupBodyText(text = text, Modifier)
    }
}

@Preview
@Composable
fun PopupPreview() {
    PopupView(iconRes = R.drawable.warning, title = "Delete user from rover?", description = "This action cannot be undone. The user will lose access immediately.", onDismiss = {}, buttonOneText = "DELETE",
        buttonOneColor = Color(0x33FFFFFF), buttonTwoText = "CANCEL", buttonTwoColor = Color(0xFFFF3131))
}