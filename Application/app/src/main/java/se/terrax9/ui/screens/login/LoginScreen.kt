package se.terrax9.ui.screens.login

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
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
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import se.terrax9.R
import se.terrax9.ui.theme.AppColors

@Composable
fun LoginScreen() {

    val viewModel: LoginViewModel = viewModel()
    var email = viewModel.email
    var password = viewModel.password
    var status = viewModel.status
    var failed = viewModel.failed

    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.BottomCenter
    ) {
        Image(
            painter = painterResource(R.drawable.background_details),
            contentDescription = null
        )
    }

    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        Text("Log In", style = MaterialTheme.typography.headlineMedium)
        Text("DEVELOPER INFO: $status")
        Input(
            tag = "E-mail",
            placeholder = "Enter your e-mail",
            onChange = { email = it; failed = false },
            isError = failed
        )

        Input(
            tag = "Password",
            placeholder = "Enter password",
            onChange = { password = it; failed = false; },
            isPassword = true,
            isError = failed
        )

        // Error message text
        if (failed) {
            Row (
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Start
            ) {
                Image(
                    painter = painterResource(R.drawable.error_icon),
                    contentDescription = null
                )
                Text("E-mail or password is wrong", color = AppColors.Error, style = MaterialTheme.typography.bodyMedium)
            }
        }

        Button(
            onClick = viewModel::login,
            modifier = Modifier
                .background(color = Color(0xFF5526FF), shape = RoundedCornerShape(size = 16.dp))
                .padding(15.dp)
        ) {
            Text("LOG IN", style = MaterialTheme.typography.headlineSmall, fontSize = 18.sp)
        }



        Text("Don't have an account?")
        Text("Sign Up")
    }
}

@Composable
fun Input(
    tag: String,
    placeholder: String,
    onChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    isPassword: Boolean = false,
    isError: Boolean = true,
    errorText: String = ""
) {
    var text by remember { mutableStateOf("") }
    var isShown by remember { mutableStateOf(false) }

    Column {
        Text(tag, color = Color.White, style = MaterialTheme.typography.headlineSmall)
        Spacer(modifier = Modifier.padding(horizontal = 8.dp))
        TextField(
            value = text,
            onValueChange = { text = it },
            modifier = modifier
                .border(
                    width = 2.dp,
                    color = if (isError) AppColors.Error else AppColors.Primary,
                    shape = RoundedCornerShape(size = 10.dp)
                )
                .background(
                    color = Color(0x1ABCC5FF),
                    shape = RoundedCornerShape(size = 10.dp)
                )
                .width(547.dp)
                .padding(vertical = 5.dp),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.Transparent,
                unfocusedContainerColor = Color.Transparent,
                cursorColor = Color.White,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            ),
            visualTransformation = if (isPassword) PasswordVisualTransformation() else VisualTransformation.None
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