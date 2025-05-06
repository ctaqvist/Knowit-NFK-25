package se.terrax9

import GalleryScreen
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import se.terrax9.ui.screens.controller.ControllerScreen
import se.terrax9.ui.screens.login.LoginScreen
import se.terrax9.ui.theme.Terrax9Theme

object Routes {
    const val Dashboard = "dashboard"
    const val Gallery = "gallery"
    const val Login = "login"
    const val Signup = "singup"
}

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Terrax9Theme {
                val navController: NavHostController = rememberNavController()

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        NavHost(
                            navController = navController,
                            startDestination = Routes.Login
                        ) {
                            composable(Routes.Dashboard) {
                                ControllerScreen(navController)
                            }
                            composable(Routes.Gallery) {
                                Text("hej")
                            }
                            composable(Routes.Login) {
                                LoginScreen(navController)
                            }
                            composable(Routes.Signup) {
                                Text("Sign up page", style = MaterialTheme.typography.titleLarge)
                            }
                        }
                    }
                }
            }
        }
    }
}
