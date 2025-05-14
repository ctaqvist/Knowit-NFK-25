package se.terrax9.ui.screens.Settings

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
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
fun SelectRoverButton(){
   Box(
       modifier = Modifier
           .width(221.dp)
           .height(38.dp)
           .background(color = Color(0x26FFFFFF), shape = RoundedCornerShape(size = 11.2.dp))
           .padding(start = 14.dp, top = 12.dp, end = 14.dp, bottom = 12.dp)
   ) {
       Row(
           horizontalArrangement = Arrangement.spacedBy(7.dp, Alignment.CenterHorizontally),
           verticalAlignment = Alignment.CenterVertically,
       ) {
           Text(
               text = "switch to another rover",
               style = TextStyle(
                   fontSize = 11.sp,
                   fontFamily = FontFamily(Font(R.font.lexendera)),
                   fontWeight = FontWeight(500),
                   color = Color(0xFFFFFFFF),
               )
           )
       }
   }
}

@Preview
@Composable
fun SelectRoverButtonPreview(){
    SelectRoverButton()
}