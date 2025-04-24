package se.emilkronholm.terrax9.ui.screens.controller

import android.graphics.drawable.Icon
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import se.emilkronholm.terrax9.R

@Composable
fun IconButton(
    text: String = "",
    iconRes: Int,
    onClick: () -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Image(
            painter = painterResource(iconRes),
            contentDescription = "Im good thank you",
            modifier = Modifier
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(Color(0xFF5526FF), Color(0xFF180757))
                    ),
                    shape = RoundedCornerShape(20.dp)
                )
                .width(118.dp)
                .border(
                    width = 1.dp,
                    color = Color(0xFFFFFFFF),
                    shape = RoundedCornerShape(size = 20.dp)
                )
                .height(118.dp)
                .padding(start = 35.dp, top = 35.dp, end = 35.dp, bottom = 35.dp)
        )
        Text(text = text, color = Color.White)
    }
}

@Preview
@Composable
fun IconButtonPreview() {
    IconButton(
        text = "Lights",
        iconRes = R.drawable.camera
    ) {

    }
}
