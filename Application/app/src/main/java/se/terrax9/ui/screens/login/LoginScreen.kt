package se.terrax9.ui.screens.login

import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview

@Composable
fun LoginScreen() {

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

    TextField(
        value = text,
        onValueChange = { text = it },
        label = { Text(placeholder) }
    )
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