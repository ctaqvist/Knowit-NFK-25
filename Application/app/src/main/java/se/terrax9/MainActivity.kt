package se.terrax9

import GalleryScreen
import SettingsScreen
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import se.terrax9.ui.screens.controller.ControllerScreen
import se.terrax9.ui.theme.Terrax9Theme

object Routes {
    val Dashboard = "dashboard"
    val Gallery = "gallery"
    val Settings = "settings"
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
                            startDestination = Routes.Dashboard
                        ) {
                            composable(Routes.Dashboard) {
                                ControllerScreen(navController)
                            }
                            composable(Routes.Gallery) {
                                GalleryScreen(navController)
                            }
                            composable(Routes.Settings) {
                                SettingsScreen(navController)
                            }
                        }
                    }
                }
            }
        }
    }
}
