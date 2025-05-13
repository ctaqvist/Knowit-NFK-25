package se.terrax9

import GalleryScreen
import SettingsScreen
import android.content.Context
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import se.terrax9.services.UserData
import se.terrax9.services.UserState
import se.terrax9.ui.screens.controller.ControllerScreen
import se.terrax9.ui.screens.controller.ControllerViewModel
import se.terrax9.ui.screens.login.LoginScreen
import se.terrax9.ui.theme.Terrax9Theme

object Routes {
    const val Dashboard = "dashboard"
    const val Gallery = "gallery"
    const val Login = "login"
    const val Signup = "singup"
    const val Settings = "settings"
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Terrax9Theme {
                // Load userdata
                val navController: NavHostController = rememberNavController()


                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->

                    val viewModel: ControllerViewModel = viewModel()
                    Box(modifier = Modifier.padding(innerPadding)) {
                        NavHost(
                            navController = navController,
                            startDestination = Routes.Login
                        ) {
                            composable(Routes.Dashboard) {
                                ControllerScreen(viewModel, navController)
                            }
                            composable(Routes.Gallery) {
                                GalleryScreen(navController)
                            }
                            composable(Routes.Settings) {
                                SettingsScreen(navController)
                            }
                            composable(Routes.Login) {
                                LoginScreen(navController)
                            }
                            composable(Routes.Signup) {
                                Text("Sign up page", style = MaterialTheme.typography.titleLarge)
                            }
                        }
                        NavHandler(navController)
                    }


                    UserStatusScreen()
                }


            }
        }
    }
}

@Composable
fun UserStatusScreen() {
    val isLoggedIn = UserData._isLoggedIn
    val token = UserData.token
    val state = UserData.status

    Column(modifier = Modifier.padding(16.dp)) {
        Text("isLoggedIn $isLoggedIn", color = Color.White, fontSize = 16.sp)
        Text("token: $token", color = Color.White, fontSize = 16.sp)
        Text("state: $state", color = Color.White, fontSize = 16.sp)
    }
}

@Composable
fun StateHandler(state: UserState, navController: NavController) {

    println("New Event: $state")
    when (state) {
        UserState.AUTH_NEEDED -> {
            UserData.loadLogin(LocalContext.current)
            UserData.status = if (UserData.isLoggedIn()) UserState.LOGGED_IN else UserState.SIGNED_OUT
        }
        UserState.SIGNED_OUT -> {

        }
        UserState.LOGGED_IN -> {

        }
    }
}

@Composable
fun NavHandler(navController: NavController) {
    val state = UserData.status
    StateHandler(state, navController)
}