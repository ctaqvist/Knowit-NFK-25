package se.terrax9.ui.screens.login

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material.TextFieldColors
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import se.terrax9.ui.theme.AppColors

@Composable
fun LoginScreen() {
    Input(
        tag = "E-mail",
        "Enter your e-mail",
        onChange = {}
    )
}

@Composable
fun Input(
    tag: String,
    placeholder: String,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isPassword: Boolean = false
) {
    var text by remember { mutableStateOf("") }
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(tag, color = Color.White)
        Spacer(modifier = Modifier.padding(horizontal = 8.dp))
        TextField(
            value = text,
            onValueChange = { text = it },
            modifier = modifier
                .align(alignment = Alignment.CenterVertically)
                .border(
                    width = 1.dp,
                    color = Color(0xFFBCC5FF),
                    shape = RoundedCornerShape(size = 10.dp)
                )
                .background(color = Color(0x1ABCC5FF), shape = RoundedCornerShape(size = 10.dp))
                .width(547.dp)
                .height(106.dp),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.Transparent,
                unfocusedContainerColor = Color.Transparent,
                cursorColor = Color.White,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            )
        )
    }
}

@Preview
@Composable
fun InputPreview1() {
    Input(
        tag = "E-mail",
        "Enter your e-mail",
        onChange = {}
    )
}

@Preview
@Composable
fun InputPreview2() {
    Input(
        tag = "Password",
        "Enter password",
        isPassword = true,
        onChange = {}
    )
}