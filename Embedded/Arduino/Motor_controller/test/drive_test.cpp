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