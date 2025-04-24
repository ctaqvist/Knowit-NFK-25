#include "gtest/gtest.h"
#include "../src/Jockes_temp/Drive.h"
#include <cmath>
using namespace std;

string stateToString(DriveState state) {
    switch(state) {
        case FORWARD:   
            return "FORWARD";
        case BACKWARD:  
            return "BACKWARD";
        case TTL:
            return "TTL";       
        case TTR:
            return "TTR";
        default:   
            return "STOPPED";
    }
}

// New tests after review
// Here I assume that speed can be negative which I don't know if it is correct.

TEST(DriveTest, FullForward) {
    Drive drive(0.0f, 1.0f);

    float speed = drive.calculateHypotenuse();

    cout << "Expected output: 1.0"
         << "\nActual output: " << speed << endl;

    EXPECT_NEAR(speed, 1.0f, 0.02f)
        << "Expected speed 1.0, but got " << speed;
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
    float expected = 0.25f;
    float actual = drive.leftSpeedFunc();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

TEST(DriveTest, RightSpeedFunc) {
    Drive drive(0.5f, 0.5f);
    float expected = 0.5f;
    float actual = drive.rightSpeedFunc();
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

// Testfall för TTL (TankTurn Left): y == 0 och x < 0
TEST(DriveTest, GetStateTTL) {
    Drive drive(-1.0f, 0.0f);
    DriveState expected = TTL;
    DriveState actual = drive.getState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.getState(), TTL) << "Expected TTL when (x=1, y=0)";
}

// Tank Turn Right
TEST(DriveTest, AlgorithmPrintsTTR) {
    Drive drive(1.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    std::string expected = "Left Speed: -1.00, Right Speed: 1.00\nState: TTR\n";
    EXPECT_EQ(output, expected);
}

// Tank Turn Left
TEST(DriveTest, AlgorithmPrintsTTL) {
    Drive drive(-1.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    std::string expected = "Left Speed: 1.00, Right Speed: -1.00\nState: TTL\n";
    EXPECT_EQ(output, expected);
}

// Testfall för Algorithm()-funktionen med capture av stdout
TEST(DriveTest, AlgorithmPrintsForward) {
    Drive drive(0.0f, 1.0f);
    testing::internal::CaptureStdout();
    drive.algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "Left Speed: 1.00, Right Speed: 1.00\nState: GO FWD\n";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}

// ska ge BACKWARD.
TEST(DriveTest, AlgorithmPrintsBackward) {
    Drive drive(0.0f, -1.0f);
    testing::internal::CaptureStdout();
    drive.algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "Left Speed: -1.00, Right Speed: -1.00\nState: GO BWD\n";
    std::cout << "Expected state: " << expected << "\nActual state: " << output << std::endl;
    
    // Assertion
    EXPECT_EQ(output, expected)
        << "Expected state: " << expected << ", but got: " << output;
}
//ska ge STOPPED
TEST(DriveTest, AlgorithmPrintsSTOPPED) {
    Drive drive(0.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.algorithm();
    std::string output = testing::internal::GetCapturedStdout();
    // Den förväntade utskriften
    std::string expected = "Left Speed: -0.00, Right Speed: 0.00\nState: STOPPED\n";
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