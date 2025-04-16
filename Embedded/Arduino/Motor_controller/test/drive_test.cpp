#include "gtest/gtest.h"
#include "../src/Jockes_temp/Drive.h"
#include <cmath>
using namespace std;

std::string stateToString(DriveState state) {
    switch(state) {
        case FORWARD:   return "FORWARD";
        case BACKWARD:  return "BACKWARD";
        case TTL:       return "TTL";        // TankTurn Left
        case TTR:       return "TTR";        // TankTurn Right
        default:   return "STOPPED";
    }
}

// New tests after review
// Here I assume that speed can be negative which I don't know if it is correct.

TEST(DriveTest, FullForward) {
    Drive drive(0.0f, 1.0f);
    float leftWheelSpeed = drive.left_speed_func();
    float rightWheelSpeed = drive.right_speed_func();
    EXPECT_NEAR(leftWheelSpeed, 1.0f, 0.02);
    EXPECT_NEAR(rightWheelSpeed, 1.0f, 0.02);
    
    float speed = drive.calculateHypotenuse();
    EXPECT_NEAR(speed, 1.0f, 0.02);

    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: (1, 1) " << "  Real output: (" << rightWheelSpeed << ", " << leftWheelSpeed << ")" << std::endl;

}
// These tests are valid if using negative speed (which might be simpler, cleaner, easier to test and more expressive at this step)
// // Full speed backwards. Both wheels should go max speed backwards (e.g. (-1, -1))
// TEST(DriveTest, FullBackwards) {
//     Drive drive(0.0f, -1.0f);
//     float leftWheelSpeed = drive.left_speed_func();
//     float rightWheelSpeed = drive.right_speed_func();
//     EXPECT_NEAR(leftWheelSpeed, -1.0f, 0.02);
//     EXPECT_NEAR(rightWheelSpeed, -1.0f, 0.02);
//     float speed = drive.calculateHypotenuse();
//     EXPECT_NEAR(speed, 1.0f, 0.02);
// }

// // Full tank turn right. Both wheels should go max speed in opposite direction (e.g. (1, -1))
// TEST(DriveTest, TankTurnLeft) {
//     Drive drive(1.0f, 0.0f);
//     float leftWheelSpeed = drive.left_speed_func();
//     float rightWheelSpeed = drive.right_speed_func();
//     EXPECT_NEAR(leftWheelSpeed, 1.0f, 0.02);
//     EXPECT_NEAR(rightWheelSpeed, -1.0f, 0.02);
//     float speed = drive.calculateHypotenuse();
//     EXPECT_NEAR(speed, 1.0f, 0.02);
// }

// // Full tank turn left. Both wheels should go max speed in opposite direction (e.g. (-1, 1))
// TEST(DriveTest, TankTurnRight) {
//     Drive drive(-1.0f, 0.0f);
//     float leftWheelSpeed = drive.left_speed_func();
//     float rightWheelSpeed = drive.right_speed_func();
//     EXPECT_NEAR(leftWheelSpeed, -1.0f, 0.02);
//     EXPECT_NEAR(rightWheelSpeed, 1.0f, 0.02);
//     float speed = drive.calculateHypotenuse();
//     EXPECT_NEAR(speed, 1.0f, 0.02);
// }

TEST(DriveTest, CalculateHypotenuse) {
    Drive drive(1.0f, 1.0f);
    float expected = 1.4f;
    float actual = drive.calculateHypotenuse();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

TEST(DriveTest, LeftSpeedFunc) {
    Drive drive(0.5f, 0.5f);
    float expected = 0.18f;
    float actual = drive.left_speed_func();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

TEST(DriveTest, RightSpeedFunc) {
    Drive drive(0.5f, 0.5f);
    float expected = 0.53f;
    float actual = drive.right_speed_func();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

// Testfall för FORWARD: y == 1 och x == 0
TEST(DriveTest, GetStateForward) {
    Drive drive(0.0f, 1.0f);
    DriveState expected = FORWARD;
    DriveState actual = drive.getState();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), FORWARD) << "Expected FORWARD when (x=0, y=1)";
}

// Testfall för BACKWARD: y == -1 och x == 0
TEST(DriveTest, GetStateBackward) {
    Drive drive(0.0f, -1.0f);
    DriveState expected = BACKWARD;
    DriveState actual = drive.getState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), BACKWARD) << "Expected BACKWARD when (x=0, y=-1)";
}

// Testfall för TTL (TankTurn Left): y == 0 och x == 1
TEST(DriveTest, GetStateTTL) {
    Drive drive(1.0f, 0.0f);
    DriveState expected = TTL;
    DriveState actual = drive.getState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), TTL) << "Expected TTL when (x=1, y=0)";
}

// Testfall för TTR (TankTurn Right): y == 0 och x == -1
TEST(DriveTest, GetStateTTR) {
    Drive drive(-1.0f, 0.0f);
    DriveState expected = TTR;
    DriveState actual = drive.getState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), TTR) << "Expected TTR when (x=-1, y=0)";
}

// Testfall för STOPPED: andra värden, ex. x=0.5 och y=0.5
TEST(DriveTest, GetStateStopped) {
    Drive drive(0.5f, 0.5f);
    DriveState expected = STOPPED;
    DriveState actual = drive.getState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), STOPPED) << "Expected STOPPED when (x=0.5, y=0.5)";
}

// Testfall för Algorithm()-funktionen med capture av stdout
TEST(DriveTest, AlgorithmPrintsForward) {
    Drive drive(0.0f, 1.0f);
    testing::internal::CaptureStdout();
    drive.Algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "State: GO FWD";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}

// ska ge BACKWARD.
TEST(DriveTest, AlgorithmPrintsBackward) {
    Drive drive(0.0f, -1.0f);
    testing::internal::CaptureStdout();
    drive.Algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "State: GO BWD";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}
// ska ge TTL.
TEST(DriveTest, AlgorithmPrintsTTL) {
    Drive drive(1.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.Algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "State: TTL";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}
// ska ge TTR
TEST(DriveTest, AlgorithmPrintsTTR) {
    Drive drive(-1.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.Algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "State: TTR";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}
//ska ge STOPPED
TEST(DriveTest, AlgorithmPrintsSTOPPED) {
    Drive drive(0.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.Algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "State: STOPPED";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}


// TO RUN MY UNIT TESTS
/* 
cmake ..
make
./drive_test
*/