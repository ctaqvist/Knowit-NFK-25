package se.terrax9.ui.screens.login

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.focusModifier
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
import androidx.navigation.NavController
import se.terrax9.R
import se.terrax9.Routes
import se.terrax9.services.UserData
import se.terrax9.services.UserState
import se.terrax9.ui.shared.AppButton
import se.terrax9.ui.theme.AppColors

@Composable
fun LoginScreen(navController: NavController) {

    val viewModel: LoginViewModel = viewModel()
    var errorMessage: String by remember { mutableStateOf("") }
    var borderColor: Color by remember { mutableStateOf(AppColors.Primary) }

    // NavController handler fuck my ass please
    val userState = UserData.status
    LaunchedEffect(userState) {
        if (userState == UserState.LOGGED_IN) {
            // Pop the fucking login ass
            navController.popBackStack(
                route = Routes.Login,
                inclusive = true
            )
            navController.navigate(Routes.Dashboard)
        }
    }

    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            errorMessage = ""
            borderColor = AppColors.Error
            when (event) {
                LoginEvent.LOGIN_SUCCESS -> {
                    borderColor = AppColors.Success
                    navController.navigate(Routes.Dashboard)
                }

                LoginEvent.UNKNOWN_ERROR -> errorMessage = "Something went wrong. Try again later."
                LoginEvent.NO_NETWORK -> errorMessage =
                    "Failed to connect to server. Check your wifi or try later."

                LoginEvent.BAD_CREDENTIALS -> errorMessage = "Wrong e-mail or password."

                else -> {
                    errorMessage = "Something went wrong. Try again later or contact support."
                }
            }
        }
    }

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
        Text("Log In", style = MaterialTheme.typography.headlineMedium, fontSize = 35.sp)
        InputFields(viewModel, borderColor)

        // Error message text
        if (viewModel.failed) {
            ErrorMessage(errorMessage)
        }

        AppButton(
            text = "LOG IN",
            onClick = viewModel::login
        )

        Text("Don't have an account?")
        Text("Sign Up", modifier = Modifier
            .padding(40.dp)
            .clickable {
                println("Sign Up clicked")
                navController.navigate(Routes.Signup)
            }
        )
    }
}

@Composable
fun InputFields(viewModel: LoginViewModel, borderColor: Color) {
    Input(
        tag = "E-mail",
        placeholder = "Enter your e-mail",
        onChange = { viewModel.email = it; viewModel.failed = false; },
        isError = viewModel.failed,
        borderColor = borderColor
    )

    Input(
        tag = "Password",
        placeholder = "Enter password",
        onChange = { viewModel.password = it; viewModel.failed = false; },
        isPassword = true,
        isError = viewModel.failed,
        borderColor = borderColor
    )
}

@Composable
fun ErrorMessage(errorMessage: String) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Start
    ) {
        Image(
            painter = painterResource(R.drawable.error_icon),
            contentDescription = null
        )
        Text(
            errorMessage,
            color = AppColors.Error,
            style = MaterialTheme.typography.bodyMedium
        )
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
    errorText: String = "",
    borderColor: Color = AppColors.Primary
) {
    var text by remember { mutableStateOf("") }
    var isShown by remember { mutableStateOf(isPassword) }

    Column {
        Text(
            tag,
            color = Color.White,
            style = MaterialTheme.typography.headlineSmall,
            fontSize = 16.8.sp
        )
        Spacer(modifier = Modifier.padding(horizontal = 8.dp))
        TextField(
            value = text,
            onValueChange = { text = it; onChange(it) },
            maxLines = 1,
            modifier = modifier
                .border(
                    width = 0.7.dp,
                    color = borderColor,
                    shape = RoundedCornerShape(size = 7.dp)
                )

                .width(382.89999.dp)
                .background(color = Color(0x1ABCC5FF), shape = RoundedCornerShape(size = 7.dp))

                .padding(start = 16.8.dp, top = 16.8.dp, end = 16.8.dp, bottom = 16.8.dp),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.Transparent,
                unfocusedContainerColor = Color.Transparent,
                cursorColor = Color.White,
                focusedTextColor = Color.White,
                unfocusedTextColor = Color.White
            ),
            visualTransformation =
            if (isShown) PasswordVisualTransformation() else VisualTransformation.None
        )

        if (isPassword) {
            Image(
                painter = painterResource(if (isShown) R.drawable.eyes_off else R.drawable.eyes_on),
                contentDescription = null,
                modifier = Modifier
                    .align(alignment = Alignment.End)
                    .offset(y = (-80).dp)
                    .height(70.dp)
                    .clickable {
                        isShown = !isShown
                    }
            )
        }
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